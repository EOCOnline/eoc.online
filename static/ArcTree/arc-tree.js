// or ESM/TypeScript import
//import Ajv from "ajv"

document.addEventListener("DOMContentLoaded", function () {
  console.clear();
  //console.log("DOM fully loaded and parsed");
  setFontSize(document.querySelector("#fontSize"));
  document.getElementById("arcTreeFile").value = "";
});


/// 'Tree Options' functionality =====================
function setFontSize(el) {
  let fontSize = el.value;
  if (!isNumber(fontSize) || fontSize < 0.5 || fontSize > 5) {
    fontSize = 1;
  }
  document.querySelector(".tree").style.fontSize = fontSize + 'em';
  document.querySelector("#fontSizeValue").innerHTML = fontSize;
  document.querySelector("#fontSize").value = fontSize;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function collapseLeafs() {
  var leafs = document.getElementsByClassName("leaf");
  var leafsLen = leafs.length;
  for (var i = 0; i < leafsLen; i++) {
    leafs[i].style.display = "none";
  }
  console.log("Collapsed all " + leafsLen + " leafs.");
}

function showLeafs() {
  var leafs = document.getElementsByClassName("leaf");
  var leafsLen = leafs.length;
  for (var i = 0; i < leafsLen; i++) {
    leafs[i].style.display = "block";
  }
  console.log("Displayed all " + leafsLen + " leafs.");
}

function collapseTree() {
  var checkboxes = document.querySelector(".tree").getElementsByTagName("input");
  var len = checkboxes.length;
  for (var i = 0; i < len; i++) {
    checkboxes[i].checked = "";
  }
  console.log("Collapsed all " + checkboxes.length + " nodes.");
}

function expandTree() {
  var checkboxes = document.querySelector(".tree").getElementsByTagName("input");
  var len = checkboxes.length;
  for (var i = 0; i < len; i++) {
    checkboxes[i].checked = "checked";
  }
  console.log("Expanded all " + checkboxes.length + " nodes.");
}



/// Import & Validate Json functionality =====================
async function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();
    fileReader.onload = event => {
      resolve(JSON.parse(event.target.result))
    };
    fileReader.onerror = (error => reject(error));
    fileReader.readAsText(file);
  });
}

async function fileChange(file) {
  readJSONFile(file).then(
    json => {
      console.log("Read new Json file: " + file.name);
      //var baseUrl = new URL(file.name, window.location.href).href;
      // TODO: get base URL from base element in JSON file

      var baseUrl = "https:\\fema.gov"
      validateJson(json);
      clearArcTree(document.getElementById('unorderedArcTree'));
      buildArcTree(json, document.getElementById('unorderedArcTree'), baseUrl);
    }
  );
}

function validateJson(json) {
  try {
    JSON.parse(json);
  } catch (e) {
    console.error("Invalid JSON: " + e);
    return false;
  }
  console.log("json validated using JSON.parse")
  return true;
}


// https://ajv.js.org/guide/getting-started.html#basic-data-validation
// https://www.npmjs.com/package/ajv

// Node.js require:
/*
const Ajv = require("ajv")
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

const schema = {
  type: "object",
  properties: {
    foo: { type: "integer" },
    bar: { type: "string" },
  },
  required: ["foo"],
  additionalProperties: false,
}

const schema2 = {
  type: "object",
  properties: {
    title: { type: "string" },
    url: { type: "string" },
    meta: { type: "string" },
    children: { type: "object" },
  },
  required: ["title"],
  additionalProperties: false,
}

const data = {
  foo: 1,
  bar: "abc",
}

const data2 = {
  title: "test title",
  url: "test url",
  meta: "test meta",
  children: {
    title: "test title",
    url: "test url",
    meta: "test meta",
    children: {
      title: "test title",
      url: "test url",
      meta: "test meta",
    }
  }
}

const validate = ajv.compile(schema)
const valid = validate(data)
if (!valid) {
  console.error(validate.errors)
} else {
  console.log("Json validated using Ajv")
}

/// Unused!
function downloadJson() {
  var json = document.getElementById('unorderedArcTree').innerHTML;
  var blob = new Blob([json], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "arcTree.json");
}

/// Unused!
function uploadJson() {
  var file = document.getElementById('arcTreeFile').files[0];
  if (file) {
    fileChange(file);
  }
}
*/


/// Tree Creation functionality =====================
var expandedByDefault = true;
var cumulativeUrls = true; // If true, append child URLs to parent URL
var listItemHTML = "";
var listLog = "";

function clearArcTree(treeElement) {
  treeElement.innerHTML = '';
}

/// <summary>
/// Recurse through an 'o' JSON object & build up an HTML unordered list
/// Parameters:
/// 'o' is the JSON object to be processed, of the following form:
/***
      o = {
        "title": "title of web page",
        "url": "relative url of web page",
        "meta": "web page description",
        "children": [{
          "title": "title of child page",
          "url": "relative url of child page",
          "meta": "child page description",
          "children": [{...}, {...}]
        }]
      }
***/
/// 'treeElement' is the HTML element to which the unordered list is to be appended
/// 'url' is this this segment of the tree's full or cumulative (N.B., see above option) url.
///   Initially url is just the base/home URL.
/// </summary>

function buildArcTree(o, treeElement, url) {
  //console.log("buildArcTree: " + o?.toString());
  for (var i in o) {
    // console.log("processing: " + i.toString());
    if (o[i] instanceof Array) {
      // console.log("got Array");
      // treeElement.appendChild(document.createComment(i + ": ARRAY"));
    }
    else if (o[i] instanceof Object) {
      // console.log("got Object");
      // treeElement.appendChild(document.createComment(i + ": OBJECT"));
    }
    else {
      //console.log(i + ': ' + o[i]);
      listLog += i + '=' + o[i] + ";  ";

      switch (i) {
        case "title": listItemHTML += "<b>" + o[i] + "</b>"; break;
        case "url":
          if (cumulativeUrls) {
            childUrl = url + o[i];
          } else {
            childUrl = o[i];
          }
          listItemHTML += " (<a href='" + url + "'>" + o[i] + "</a>): ";
          break;
        case "meta": listItemHTML += "<i> Level " + o[i] + "</i>"; break;
        default: listItemHTML += " [Unknown node (" + i + ")=" + o[i] + "] ";
      }
    }

    if (o[i] instanceof Object) {

      if (listItemHTML != "") {
        // console.log("=== dump caches!");
        // Output list item we've been building up before processing children
        console.log(listLog);
        listLog = "";

        var uniqueID = Math.floor(Math.random() * 1000000).toString();
        var newLI = document.createElement('li');

        var newInput = document.createElement('input');
        newInput.id = "c" + uniqueID;
        newInput.type = "checkbox";
        newInput.checked = expandedByDefault;

        var newLabel = document.createElement('label');
        newLabel.htmlFor = "c" + uniqueID;
        newLabel.className = "tree_label";
        newLabel.innerHTML = DOMPurify.sanitize(listItemHTML);  //NOTE: Sanitization is not needed with trusted JSON

        // Or if last leaf (no children), add a leaf class
        if (Object.keys(o[i]).length == 0) {
          newLI.className = "leaf";
          var newSpan = document.createElement('span');
          newSpan.className = "tree_label";
          newSpan.innerHTML = DOMPurify.sanitize(listItemHTML);  //NOTE: Sanitization is not needed with trusted JSON
          newLI.appendChild(newSpan);
        }
        listItemHTML = "";
        treeElement.appendChild(newLI);

        if (Object.keys(o[i]).length > 0) {
          newLI.appendChild(newInput);
          newLI.appendChild(newLabel);
        }
        treeElement = newLI;
      }

      var newUL = treeElement;
      if (o[i] instanceof Array) {
        newUL = document.createElement('ul');
        // newUL.className = "array";
        treeElement.appendChild(newUL);
      } else if (o[i] instanceof Object) {
        // no need to create a new UL for non-arrays
        //newUL = treeElement;
      }

      console.group("children of " + i);
      buildArcTree(o[i], newUL, childUrl);
      console.groupEnd();
    }
  }
}
