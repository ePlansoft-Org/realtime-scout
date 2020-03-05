parameters = [{
    key: 'accessible',
    isActive: true,
    allowFailed: false,
    // password: false,
    icon: 'eye',
    description: 'Check invalid, corrupt, password-protected'
}, {
    key: 'filename',
    isActive: true,
    allowFailed: false,
    specialCharacters: ['#', '+', '&', '%'],
    icon: 'file',
    description: 'Check invalid filename.'
}, {
    key: 'pageAccess',
    isActive: true,
    allowFailed: false,
    icon: 'eye',
    description: 'Check invalid, corrupt page'
}, {
    key: 'annotation',
    isActive: true,
    allowFailed: false,
    allowSubtypes: ['Link', 'Highlight', 'UnderLine', 'Widget'],
    options: [
        'Text', 'Link', 'Freetext', 'Line', 'Square', 'Circle', 'Polygon', 'Polyline',
        'Highlight', 'Underline', 'Squiggly', 'Strikeout', 'Stamp', 'Caret', 'Ink',
        'Popup', 'Fileattachment', 'Sound', 'Movie', 'Widget', 'Screen', 'Printermark',
        'Trapnet', 'WaterMark', 'Threed', 'Redact', 'Sig','AUTOCAD_SHX'
    ],
    filters: {
        // filter out annotaion with title="AutoCAD SHX Text"
        disable_AUTOCAD_SHX: true
    },
    icon: 'comment-text',
    description: 'Check unexpected annotations like stamp, freetext'
}, {
    key: 'metadata',
    isActive: true,
    allowFailed: false,
    icon: 'archive',
    description: 'Check unexpected metadata like embedded pdfs'
}, {
    key: 'operator',
    isActive: false,
    allowFailed: false,
    icon: 'tag-outline',
    description: 'Check all operators in pdf, takes lots of time.'
}, {
    key: 'resolution',
    isActive: true,
    allowFailed: false,
    // Letter size @ 72dpi
    minimumSide: 612,
    minimum: 612 * 792,
    // 48 inch x 36 inch @ 72dpi
    maximumSide: 3456,
    maximum: 3456 * 2592,
    icon: 'tab-unselected',
    description: 'Check low resolution pages'
}, {
    key: 'rotation',
    isActive: true,
    allowFailed: true,
    icon: 'screen-rotation',
    description: 'Check different orientation'
}, {
    key: 'size',
    isActive: true,
    allowFailed: false,
    maximum: 400 * 1024 * 1024,
    minimum: 10 * 1024,
    icon: 'harddisk',
    description: 'Check pdf file size'
}, {
    key: 'pageCount',
    isActive: true,
    allowFailed: false,
    maximum: 500,
    icon: 'harddisk',
    description: 'Check pdf page count'
}, {
    key: 'textContent',
    isActive: false,
    allowFailed: true,
    icon: 'format-text',
    description: 'Check texts and fonts'
}, {
    key: 'version',
    isActive: true,
    allowFailed: true,
    minimum: 1.4,
    icon: 'backup-restore',
    description: 'Check generated pdf version'
}];
