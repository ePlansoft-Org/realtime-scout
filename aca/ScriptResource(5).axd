﻿Type.registerNamespace("AjaxControlToolkit");AjaxControlToolkit.TimeSpan=function(){var a=this;if(arguments.length==0)a._ctor$0.apply(a,arguments);else if(arguments.length==1)a._ctor$1.apply(a,arguments);else if(arguments.length==3)a._ctor$2.apply(a,arguments);else if(arguments.length==4)a._ctor$3.apply(a,arguments);else if(arguments.length==5)a._ctor$4.apply(a,arguments);else throw Error.parameterCount()};AjaxControlToolkit.TimeSpan.prototype={_ctor$0:function(){this._ticks=0},_ctor$1:function(a){this._ctor$0();this._ticks=a},_ctor$2:function(c,a,b){this._ctor$0();this._ticks=c*AjaxControlToolkit.TimeSpan.TicksPerHour+a*AjaxControlToolkit.TimeSpan.TicksPerMinute+b*AjaxControlToolkit.TimeSpan.TicksPerSecond},_ctor$3:function(d,c,a,b){this._ctor$0();this._ticks=d*AjaxControlToolkit.TimeSpan.TicksPerDay+c*AjaxControlToolkit.TimeSpan.TicksPerHour+a*AjaxControlToolkit.TimeSpan.TicksPerMinute+b*AjaxControlToolkit.TimeSpan.TicksPerSecond},_ctor$4:function(e,d,b,c,a){this._ctor$0();this._ticks=e*AjaxControlToolkit.TimeSpan.TicksPerDay+d*AjaxControlToolkit.TimeSpan.TicksPerHour+b*AjaxControlToolkit.TimeSpan.TicksPerMinute+c*AjaxControlToolkit.TimeSpan.TicksPerSecond+a*AjaxControlToolkit.TimeSpan.TicksPerMillisecond},getDays:function(){return Math.floor(this._ticks/AjaxControlToolkit.TimeSpan.TicksPerDay)},getHours:function(){return Math.floor(this._ticks/AjaxControlToolkit.TimeSpan.TicksPerHour)%24},getMinutes:function(){return Math.floor(this._ticks/AjaxControlToolkit.TimeSpan.TicksPerMinute)%60},getSeconds:function(){return Math.floor(this._ticks/AjaxControlToolkit.TimeSpan.TicksPerSecond)%60},getMilliseconds:function(){return Math.floor(this._ticks/AjaxControlToolkit.TimeSpan.TicksPerMillisecond)%1e3},getDuration:function(){return new AjaxControlToolkit.TimeSpan(Math.abs(this._ticks))},getTicks:function(){return this._ticks},getTotalDays:function(){Math.floor(this._ticks/AjaxControlToolkit.TimeSpan.TicksPerDay)},getTotalHours:function(){return Math.floor(this._ticks/AjaxControlToolkit.TimeSpan.TicksPerHour)},getTotalMinutes:function(){return Math.floor(this._ticks/AjaxControlToolkit.TimeSpan.TicksPerMinute)},getTotalSeconds:function(){return Math.floor(this._ticks/AjaxControlToolkit.TimeSpan.TicksPerSecond)},getTotalMilliseconds:function(){return Math.floor(this._ticks/AjaxControlToolkit.TimeSpan.TicksPerMillisecond)},add:function(a){return new AjaxControlToolkit.TimeSpan(this._ticks+a.getTicks())},subtract:function(a){return new AjaxControlToolkit.TimeSpan(this._ticks-a.getTicks())},negate:function(){return new AjaxControlToolkit.TimeSpan(-this._ticks)},equals:function(a){return this._ticks==a.getTicks()},compareTo:function(a){if(this._ticks>a.getTicks())return 1;else if(this._ticks<a.getTicks())return -1;else return 0},toString:function(){return this.format("F")},format:function(a){if(!a)a="F";if(a.length==1)switch(a){case "t":a=AjaxControlToolkit.TimeSpan.ShortTimeSpanPattern;break;case "T":a=AjaxControlToolkit.TimeSpan.LongTimeSpanPattern;break;case "F":a=AjaxControlToolkit.TimeSpan.FullTimeSpanPattern;break;default:throw Error.createError(String.format(AjaxControlToolkit.Resources.Common_DateTime_InvalidTimeSpan,a))}var e=/dd|d|hh|h|mm|m|ss|s|nnnn|nnn|nn|n/g,c=new Sys.StringBuilder,d=this._ticks;if(d<0){c.append("-");d=-d}for(;true;){var f=e.lastIndex,b=e.exec(a);c.append(a.slice(f,b?b.index:a.length));if(!b)break;switch(b[0]){case "dd":case "d":c.append($common.padLeft(Math.floor(d/AjaxControlToolkit.TimeSpan.TicksPerDay,b[0].length,"0")));break;case "hh":case "h":c.append($common.padLeft(Math.floor(d/AjaxControlToolkit.TimeSpan.TicksPerHour)%24,b[0].length,"0"));break;case "mm":case "m":c.append($common.padLeft(Math.floor(d/AjaxControlToolkit.TimeSpan.TicksPerMinute)%60,b[0].length,"0"));break;case "ss":case "s":c.append($common.padLeft(Math.floor(d/AjaxControlToolkit.TimeSpan.TicksPerSecond)%60,b[0].length,"0"));break;case "nnnn":case "nnn":case "nn":case "n":c.append($common.padRight(Math.floor(d/AjaxControlToolkit.TimeSpan.TicksPerMillisecond)%1e3,b[0].length,"0",true));break;default:Sys.Debug.assert(false)}}return c.toString()}};AjaxControlToolkit.TimeSpan.parse=function(j){var b=".",a=j.split(":"),i=0,f=0,g=0,d=0,h=0,e=0;switch(a.length){case 1:if(a[0].indexOf(b)!=-1){var c=a[0].split(b);d=parseInt(c[0]);h=parseInt(c[1])}else e=parseInt(a[0]);break;case 2:f=parseInt(a[0]);g=parseInt(a[1]);break;case 3:f=parseInt(a[0]);g=parseInt(a[1]);if(a[2].indexOf(b)!=-1){var c=a[2].split(b);d=parseInt(c[0]);h=parseInt(c[1])}else d=parseInt(a[2]);break;case 4:i=parseInt(a[0]);f=parseInt(a[1]);g=parseInt(a[2]);if(a[3].indexOf(b)!=-1){var c=a[3].split(b);d=parseInt(c[0]);h=parseInt(c[1])}else d=parseInt(a[3])}e+=i*AjaxControlToolkit.TimeSpan.TicksPerDay+f*AjaxControlToolkit.TimeSpan.TicksPerHour+g*AjaxControlToolkit.TimeSpan.TicksPerMinute+d*AjaxControlToolkit.TimeSpan.TicksPerSecond+h*AjaxControlToolkit.TimeSpan.TicksPerMillisecond;if(!isNaN(e))return new AjaxControlToolkit.TimeSpan(e);throw Error.create(AjaxControlToolkit.Resources.Common_DateTime_InvalidFormat)};AjaxControlToolkit.TimeSpan.fromTicks=function(a){return new AjaxControlToolkit.TimeSpan(a)};AjaxControlToolkit.TimeSpan.fromDays=function(a){return new AjaxControlToolkit.TimeSpan(a*AjaxControlToolkit.TimeSpan.TicksPerDay)};AjaxControlToolkit.TimeSpan.fromHours=function(a){return new AjaxControlToolkit.TimeSpan(a*AjaxControlToolkit.TimeSpan.TicksPerHour)};AjaxControlToolkit.TimeSpan.fromMinutes=function(a){return new AjaxControlToolkit.TimeSpan(a*AjaxControlToolkit.TimeSpan.TicksPerMinute)};AjaxControlToolkit.TimeSpan.fromSeconds=function(){return new AjaxControlToolkit.TimeSpan(minutes*AjaxControlToolkit.TimeSpan.TicksPerSecond)};AjaxControlToolkit.TimeSpan.fromMilliseconds=function(){return new AjaxControlToolkit.TimeSpan(minutes*AjaxControlToolkit.TimeSpan.TicksPerMillisecond)};AjaxControlToolkit.TimeSpan.TicksPerDay=8.64e11;AjaxControlToolkit.TimeSpan.TicksPerHour=3.6e10;AjaxControlToolkit.TimeSpan.TicksPerMinute=6e8;AjaxControlToolkit.TimeSpan.TicksPerSecond=1e7;AjaxControlToolkit.TimeSpan.TicksPerMillisecond=1e4;AjaxControlToolkit.TimeSpan.FullTimeSpanPattern="dd:hh:mm:ss.nnnn";AjaxControlToolkit.TimeSpan.ShortTimeSpanPattern="hh:mm";AjaxControlToolkit.TimeSpan.LongTimeSpanPattern="hh:mm:ss";Date.prototype.getTimeOfDay=function Date$getTimeOfDay(){var a=this;return new AjaxControlToolkit.TimeSpan(0,a.getHours(),a.getMinutes(),a.getSeconds(),a.getMilliseconds())};Date.prototype.getDateOnly=function Date$getDateOnly(){return new Date(this.getFullYear(),this.getMonth(),this.getDate())};Date.prototype.add=function Date$add(a){return new Date(this.getTime()+a.getTotalMilliseconds())};Date.prototype.subtract=function Date$subtract(a){return this.add(a.negate())};Date.prototype.getTicks=function Date$getTicks(){return this.getTime()*AjaxControlToolkit.TimeSpan.TicksPerMillisecond};AjaxControlToolkit.FirstDayOfWeek=function(){};AjaxControlToolkit.FirstDayOfWeek.prototype={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6,Default:7};AjaxControlToolkit.FirstDayOfWeek.registerEnum("AjaxControlToolkit.FirstDayOfWeek");