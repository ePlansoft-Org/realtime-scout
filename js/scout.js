
// run Scout argument is PDF data as Base64 encoded
function runScout(pdfDataBase64, pdf, parameters) {
  var analysis = new Analysis(pdf.name, pdf.size, parameters);

  // 1) check filesize
  checkFileSize(analysis);

  // 2) check file name
  checkFilename(filename, analysis);

  // convert PDF to Base64
  var pdfData = convertDataURIToBinary(pdfDataBase64);
  var loadingTask = pdfjsLib.getDocument({data: pdfData});
  loadingTask.promise.then(async function(pdf) {
      analysis.setPDFDoc(pdf);

      analysis.addResult("accessible", true, "");

      await getBasicInformation(analysis);

      // 3) check PDF version
      await checkVersion(pdf, analysis);

      var annotationErrors = [];
      var pageResolutionErrors = [];
      for (var n = 1; n <= pdf._pdfInfo.numPages; n++) {
        var pageNumber = n;
        await pdf.getPage(pageNumber).then(
          async function(page) {
            // 4) check orientation
            checkOrientation(page, analysis);

            // 5) check annotations
            checkAnnotations(page, analysis, annotationErrors);

            // 6) check page dimensions
            checkPageResolution(page, analysis, pageResolutionErrors);
          },
          function(reason) {
            console.error("Error failed to load PDF: ", reason);
          }
        );
      }

      analysis.addResult("annotation", true, annotationErrors);

      if (pageResolutionErrors && pageResolutionErrors.length) {
        analysis.addResult("resolution", false, pageResolutionErrors);
      }
      else {
        analysis.addResult("resolution", true);
      }

      checkPDFPages(analysis);
      console.log("checkPDFPages: ", analysis);

      showScoutResults(analysis);

    },
    function(reason) {
      console.error("Error loading PDF file: ", reason); // PDF loading error
    }
  );
}

function showScoutResults(analysis) {
  var scoutResult = "";
  analysis.pdf.results.forEach(e => {
      e.allowFailed = parameters.filter(p => { return p.key == e.key })[0].allowFailed;

      switch (e.key) {
          case 'filename':
              e.message = e.success == true ? 'Filename is valid.' : 'Filename can not contain special characters: #, +, &, (, )';
              break;
          case 'accessible':
              e.message = e.success == true ? 'File is accessible' : 'File is NOT accessible';
              break;
          case 'version':
              e.message = e.success == true ? 'PDF version is compatible' : 'PDF version is not compatible';
              break;
          case 'metadata':
              e.message = e.success == true ? 'No metadata issues' : 'There are metadata issues';
              break;
          case 'size':
              e.message = e.success == true ? 'File size is within limit' : 'File size is NOT within limit';
              break;
          case 'rotation':
              e.message = e.success == true ? 'All pages have same orientation' : 'NOT all pages have same orientation';
              break;
          case 'pageAccess':
              e.message = e.success == true ? 'All pages are accessible' : 'NOT all pages are accessible';
              break;
          case 'annotation':
              e.message = e.success == true ? 'File has no unexpected annotations' : 'File has unexpected annotations';
              break;
          case 'resolution':
              e.message = e.success == true ? 'File has good resolution' : 'File has BAD resolution';
              break;
          case 'textContent':
              e.message = e.success == true ? 'File have good text content' : 'File has BAD text content';
              break;
          default:
              break;
      }

      if (e.success) {
        scoutResult += "<span class=success>" + e.message + "</div>";
      }
      else {
        scoutResult += "<span class=error>" + e.message + "</div>";
      }
      
  });

  // show on page
  document.getElementById('filesToUpload').innerHTML = scoutResult;
}

function checkVersion(pdf, analysis) {
  pdf.getMetadata().then(function(metadata) {
      var version = metadata.info.PDFFormatVersion;

      var minVersion = parseFloat(analysis.getParameter("version").minimum);
      if (minVersion && minVersion > version) {
        analysis.addResult("version", false, `${minVersion}+ (${version})`);
      } else {
        analysis.addResult("version", true, `${version}`);
      }
    })
    .catch(function(err) {
      console.log("Error getting meta data: ", err);
    });
}

function checkFileSize(analysis) {
  console.log("checkFileSize...");
  var filesize = analysis.get("filesize");
  var maximum = parseFloat(analysis.getParameter("size").maximum);
  var minimum = parseFloat(analysis.getParameter("size").minimum);
  var filesizeValue = (filesize / 1024 / 1024).toFixed(2) + " MB";
  var maximumValue = (maximum / 1024 / 1024).toFixed(2) + " MB";
  var minimumValue = (minimum / 1024 / 1024).toFixed(2) + " MB";

  var message = `${minimumValue} - ${maximumValue} (${filesizeValue})`;

  if (filesize > maximum || filesize < minimum) {
    var message = `${minimumValue} - ${maximumValue} (${filesizeValue})`;
    analysis.addResult("size", false, filesizeValue);
  } else {
    analysis.addResult("size", true, filesizeValue);
  }
}

async function checkAnnotations(page, analysis, annotationErrors) {
  var configAnnotation = analysis.getParameter("annotation");
  const allowSubtypes = configAnnotation.allowSubtypes.map(subtype => {
    return subtype.toLowerCase();
  });
  var notAllowedSubtypes = {};
  await page
    .getAnnotations()
    .then(function(annotations) {
      /***** check annotations *****/
      annotations.forEach(annotation => {
        let subtype = annotation.subtype;
        // use custom subtype
        if (annotation.title) {
          if (annotation.title.toUpperCase().indexOf("AUTOCAD") !== -1 && annotation.title.toUpperCase().indexOf("SHX") !== -1) {
            if (configAnnotation.filters && configAnnotation.filters.disable_AUTOCAD_SHX) {
              subtype = "AUTOCAD_SHX";
            }
          }
        }

        // if subtype not in array, add it.
        if (!allowSubtypes.includes(subtype.toLowerCase())) {
          notAllowedSubtypes[subtype] = notAllowedSubtypes[subtype] ? notAllowedSubtypes[subtype] + 1: 1;
        }
      });

      var error = "";
      for (let type in notAllowedSubtypes) {
        if (notAllowedSubtypes[type]) {
          error = `Page ${page.pageNumber}: ${type} x${notAllowedSubtypes[type]}.`;
        }
      }

      if (error) annotationErrors.push(error);
    })
    .catch(function(err) {
      console.log("Error getting annotations: ", err);
    });
}

function checkPageResolution(page, analysis, pageResolutionErrors) {
    const minimum = parseInt(analysis.getParameter('resolution').minimum);
    const maximum = parseInt(analysis.getParameter('resolution').maximum);

    const minimumSide = parseInt(analysis.getParameter('resolution').minimumSide);
    const maximumSide = parseInt(analysis.getParameter('resolution').maximumSide);

    const viewBox = page.getViewport().viewBox;
    const width = Math.abs(viewBox[2] - viewBox[0]);
    const height = Math.abs(viewBox[3] - viewBox[1]);

    // The issue was the longSide variable used for both minimum and maximum. Ths is not right.
    // There is a possibility that shortSide < minimumSide < longSide can be true.
    // Now we use shortSide for minimumSide and longside for maximumSide.
    const longSide = (width > height) ? width : height;
    const shortSide = (width < height) ? width : height;
    var error = "";
    if (shortSide < minimumSide || longSide > maximumSide) {
        // create new errMessage format shows page's resolution for better debuging purpose
        const minX = minimumSide / 72;
        const minY = minimum / minimumSide / 72;
        const maxX = maximumSide / 72;
        const maxY = maximum / maximumSide / 72;
        error = `Page ${page.pageNumber}: Incorrect resolution (${(width / 72).toFixed(2)}x${(height / 72).toFixed(2)}). Minimum (${minX}x${minY}) or Maximum (${maxX}x${maxY}) required.`;
        pageResolutionErrors.push(error);
    }
}

function checkOrientation(page, analysis) {
  var scale = 1.0;
  var viewport = page.getViewport({
    scale: scale
  });

  var width = viewport.width + " (pixels) " + viewport.width / 72 + " (inches)";
  var height = viewport.height + " (pixels) " + viewport.height / 72 + " (inches)";

  var side1 = page.view[2] - page.view[0];
  var side2 = page.view[3] - page.view[1];
  var orientation, width, height;

  if ((side1 > side2 && page.rotate % 180 === 0) || (side1 < side2 && page.rotate % 180 !== 0)) {
    orientation = "Landscape";
    width = side1 > side2 ? side1 : side2;
    height = side1 > side2 ? side2 : side1;
  } else {
    orientation = "Portrait";
    width = side1 > side2 ? side2 : side1;
    height = side1 > side2 ? side1 : side2;
  }

  var pageOrientation = "[page] " + page.pageNumber + " orientation: " + orientation;

  var dimension = {
    pageNumber: page.pageNumber,
    mediaBox: page.view,
    rotate: page.rotate,
    orientation,
    width,
    height
  };

  var pageNum = page.pageNumber;
  var pageResult = {
    pageNum,
    dimension: dimension
  };

  var pages = analysis.get("pages");
  pages.push(pageResult);
  analysis.set("pages", pages);
}

function checkFilename(filename, analysis) {
  // check filename first
  var filenameConfig = analysis.getParameter("filename");
  var isPassed = true;
  if (filenameConfig && filenameConfig.isActive) {
    var specialCharacters = filenameConfig.specialCharacters || [];
    for (let i in specialCharacters) {
      if (filename.indexOf(specialCharacters[i]) !== -1) {
        isPassed = false;
        break;
      }
    }
  }

  analysis.addResult("filename", isPassed, filename);
}


function getBasicInformation(analysis) {
  var informations = [
    analysis.getPDFDoc().getOutline(),
    analysis.getPDFDoc().getMetadata()
  ];

  Promise.all(informations).then(results => {
    analysis.set("outlines", results[0]);
    var metadata = results[1];
    analysis.set("creator", metadata.info.Creator || "");
    var version = parseFloat(metadata.info.PDFFormatVersion);
    analysis.set("version", version);
    analysis.set("numPages", analysis.getPDFDoc()._pdfInfo.numPages);

    // check metadata
    if (metadata.metadata !== null) {
      var md = metadata.metadata.getAll();
      if (
        md["xmpmm:derivedfrom"] ||
        md["xmpmm:ingredients"] ||
        md["xmpmm:manifest"] ||
        md["xmptpg:swatchgroups"] ||
        md["xmp:thumbnails"]
      ) {
        analysis.addResult("metadata", false, md);
      } else {
        analysis.addResult("metadata", true);
      }
    }
  });
}

function checkPDFPages(analysis) {
  var pageNumbers = [];
  for (var i = 1; i <= analysis.get("numPages"); i++) {
    pageNumbers.push(i);
  }

  var keys = ["pageAccess", "textContent", "operator"];

  var parameters = keys.reduce((array, key) => {
    var param = analysis.getParameter(key);
    if (param.isActive) {
      array.push(param);
    }
    return array;
  }, []);

  return pageNumbers.reduce((promiseChain, pageNumber) => {
      return promiseChain
        .then(() => {
          return analysis.getPage(pageNumber);
        })
        .then(page => {
          var checkers = [];

          return Promise.all(checkers).then(results => {
            const pageResult = {
              pageNumber,
              //dimension: getPageDimension(page)
            };
            return analysis;
          });

        })
        .catch((e) => {
          console.error(e);
        });
    }, Promise.resolve(analysis))
    .then(analysis => {
      var pages = analysis.get("pages");
      var firstPageOrientation = pages[0].dimension.orientation;
      var rotatedPageNumbers = [];
      var failed = {};
      var pageDimensions = {};
      pages.forEach(page => {
        for (var prop in page) {
          if (page[prop] && page[prop].errMessage) {
            failed[prop] = failed[prop] || [];
            failed[prop].push(page[prop].errMessage);
          }
          if (page.dimension.orientation !== firstPageOrientation) {
            if (rotatedPageNumbers.indexOf(page.pageNumber) == -1) {
              rotatedPageNumbers.push(page.pageNumber);
            }
          }
        }
        pageDimensions[page.pageNumber] = page.dimension;
      });

      analysis.set("pageDimensions", pageDimensions);

      // rotation
      if (rotatedPageNumbers.length > 0) {
        analysis.addResult("rotation", false, rotatedPageNumbers);
      } else {
        analysis.addResult("rotation", true);
      }

      // all failed
      for (var key in failed) {
        analysis.addResult(key, false, failed[key]);
        var pos = parameters.findIndex(item => item.key === key);
        parameters.splice(pos, 1);
      }

      // all passed
      parameters.forEach(param => {
        analysis.addResult(param.key, true);
      });

      Promise.resolve(analysis);
    });
}

function pageAccess() {
  var result = {
    value: null,
    errMessage: null,
    debugData: null
  }
  return Promise.resolve(result);
}

function getPageDimension(page) {
  if (!page) return {};
  var side1 = page.view[2] - page.view[0];
  var side2 = page.view[3] - page.view[1];
  var orientation, width, height;

  if ((side1 > side2 && page.rotate % 180 === 0) || (side1 < side2 && page.rotate % 180 !== 0)) {
    orientation = "Landscape";
    width = side1 > side2 ? side1 : side2;
    height = side1 > side2 ? side2 : side1;
  } else {
    orientation = "Portrait";
    width = side1 > side2 ? side2 : side1;
    height = side1 > side2 ? side1 : side2;
  }

  return {
    pageNumber: page.pageNumber,
    mediaBox: page.view,
    rotate: page.rotate,
    orientation,
    width,
    height
  };
}

// utility function
function convertDataURIToBinary(dataURI) {
  var BASE64_MARKER = ";base64,";

  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for (var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}