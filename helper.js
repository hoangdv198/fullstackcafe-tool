const fs = require("fs");

const trashClass = ["_ATmkjn","_3NZkPV"]

function removeElementByClassName(className) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
  return elements;
}

function getElementContainerByClassName() {
  trashClass.forEach(removeElementByClassName)
  removeElementByClassName("_3NZkPV");
  const title = document.getElementsByClassName("_SoZTOW font-weight-bold");
  const element = document.getElementsByClassName("_2VQuOG _3NT6Zz");
  const level = document.getElementsByClassName("clickable badge");
  const correct = level.length - element.length;
  const listQuestArr = [];
  for (let i = 0; i < title.length; i++) {
    const itemElementLevel = level[correct + i]?.innerText;

    const source = document.querySelectorAll('[rel="noreferrer"]')[i]?.outerHTML;

    listQuestArr.push({
      id: i,
      title: title[i]?.outerHTML,
      answer: element[i]?.outerHTML,
      source: source,
      level: itemElementLevel,
    });
  }
  console.log(JSON.stringify(listQuestArr));
  const json = JSON.stringify(listQuestArr);
  return listQuestArr;
}

function toJSON(node) {
  let propFix = { for: "htmlFor", class: "className" };
  let specialGetters = {
    style: (node) => node.style.cssText,
  };
  let attrDefaultValues = { style: "" };
  let obj = {
    nodeType: node.nodeType,
  };
  if (node.tagName) {
    obj.tagName = node.tagName.toLowerCase();
  } else if (node.nodeName) {
    obj.nodeName = node.nodeName;
  }
  if (node.nodeValue) {
    obj.nodeValue = node.nodeValue;
  }
  let attrs = node.attributes;
  if (attrs) {
    let defaultValues = new Map();
    for (let i = 0; i < attrs.length; i++) {
      let name = attrs[i].nodeName;
      defaultValues.set(name, attrDefaultValues[name]);
    }
    // Add some special cases that might not be included by enumerating
    // attributes above. Note: this list is probably not exhaustive.
    switch (obj.tagName) {
      case "input": {
        if (node.type === "checkbox" || node.type === "radio") {
          defaultValues.set("checked", false);
        } else if (node.type !== "file") {
          // Don't store the value for a file input.
          defaultValues.set("value", "");
        }
        break;
      }
      case "option": {
        defaultValues.set("selected", false);
        break;
      }
      case "textarea": {
        defaultValues.set("value", "");
        break;
      }
    }
    let arr = [];
    for (let [name, defaultValue] of defaultValues) {
      let propName = propFix[name] || name;
      let specialGetter = specialGetters[propName];
      let value = specialGetter ? specialGetter(node) : node[propName];
      if (value !== defaultValue) {
        arr.push([name, value]);
      }
    }
    if (arr.length) {
      obj.attributes = arr;
    }
  }
  let childNodes = node.childNodes;
  // Don't process children for a textarea since we used `value` above.
  if (obj.tagName !== "textarea" && childNodes && childNodes.length) {
    let arr = (obj.childNodes = []);
    for (let i = 0; i < childNodes.length; i++) {
      arr[i] = toJSON(childNodes[i]);
    }
  }
  return obj;
}

function convertHtmlString(htmlString) {
  var results = [];
  htmlString.replace(
    /([^<>]*?)(<\/?[-:\w]+(?:>|\s[^<>]*?>)|$)/g,
    function (a, b, c) {
      if (b) results.push(b);
      if (c) results.push(c);
    }
  );
  //filter
  const convertData = results.map((data, index) => {
    const isTagHtml = data.match(/<[^>]*>/g);
    if (isTagHtml) {
      // string to html
      if (data.includes("<code>")) {
        console.log(data, results[index + 1]);
        return {
          type: "code",
          text: null,
        };
      }
      if (data.includes("</p>")) {
        console.log(data, results[index + 1]);
        return {
          type: "</p>",
          text: null,
        };
      }
      if (data.includes("<p>")) {
        console.log(data, results[index + 1]);
        return {
          type: "<p>",
          text: null,
        };
      }
      if (data.includes("<strong>")) {
        console.log(data, results[index + 1]);
        return {
          type: "strong",
          text: null,
        };
      } else if (data.includes("<em>")) {
        console.log(data, results[index + 1]);
        return {
          type: "em",
          text: null,
        };
      } else if (data.includes('="token"')) {
        const color = data.match(
          /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/gi
        );
        return {
          type: "color",
          text: color[0],
        };
      } else if (
        data.includes("<ul>") ||
        data.includes("<ol>") ||
        data.includes("</ul>") ||
        data.includes("</ol>")
      ) {
        return {
          type: "ul",
          text: null,
        };
      } else if (data.includes("<li>") || data.includes("</li>")) {
        return {
          type: "li",
          text: null,
        };
      } else if (data.includes("<pre")) {
        console.log(data, results[index + 1]);
        return {
          type: "pre",
          text: null,
        };
      } else if (data.includes("<img")) {
        console.log(
          data.match(
            /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
          )
        );
        return {
          type: "img",
          text: data.match(
            /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
          ),
        };
      } else if (data.includes("&lt;")) {
        console.log(data, results[index + 1]);
        return {
          type: "text",
          text: "<",
        };
      } else if (data.includes("&gt;")) {
        console.log(data, results[index + 1]);
        return {
          type: "text",
          text: "<",
        };
      } else if (data.includes("&le;")) {
        console.log(data, results[index + 1]);
        return {
          type: "text",
          text: "≤",
        };
      } else if (data.includes("&ge;")) {
        console.log(data, results[index + 1]);
        return {
          type: "text",
          text: "≥",
        };
      }
      //
      return;
    }
    console.log(data);
    return {
      type: "text",
      text: data,
    };
  });
  console.log("---convertData", convertData);
  return convertData.filter((item) => item);
}

function changeClassByClassName(className, classNameChange) {
  const element = document.getElementsByClassName(className);

  while (element.length) {
    element[0].className = classNameChange;
  }
}

function generator() {
  fs.writeFile("myjsonfile.json", json, "utf8");
}

function testFunc(classNameAnswer) {
  const element = document.getElementsByClassName(classNameAnswer);
  const listQuestArr = [];
  for (let i = 0; i < element.length; i++) {
    const itemElement = element[i].getElementsByClassName("blockView");
    for (let i = 0; i < itemElement.length; i++) {
      listQuestArr.push(itemElement[i].outerHTML);
    }
  }
  return listQuestArr;
}
