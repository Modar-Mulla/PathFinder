// functions
// function post(path, params, method = "post") {
//   // The rest of this code assumes you are not using a library.
//   // It can be made less verbose if you use one.
//   const form = document.createElement("form");
//   form.method = method;
//   form.action = path;

//   for (const key in params) {
//     if (params.hasOwnProperty(key)) {
//       const hiddenField = document.createElement("input");
//       hiddenField.type = "hidden";
//       hiddenField.name = key;
//       hiddenField.value = params[key];

//       form.appendChild(hiddenField);
//     }
//   }

//   document.body.appendChild(form);
//   form.submit();
// }

// function sendJSON(graph) {
//   let xhr = new XMLHttpRequest();
//   let url = "http://127.0.0.1:8000/getShortestPath/";

//   xhr.open("POST", url, true);

//   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded ");

//   xhr.onreadystatechange = function () {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//       console.log("done");
//     }
//   };

//   var data = JSON.stringify(graph);
//   console.log(typeof data);
//   console.log(data);
//   xhr.send(data);
// }

function dropAlert(text) {
  let dropDownAlert = document.createElement("div");
  dropDownAlert.classList.add("alert", "alert-dark");
  setTimeout(() => {
    dropDownAlert.classList.add("drop-alert");
  }, 100);
  dropDownAlert.textContent = text;
  document.body.appendChild(dropDownAlert);
  setTimeout(() => {
    dropDownAlert.classList.remove("drop-alert");
  }, 2000);
  setTimeout(() => {
    document.body.removeChild(dropDownAlert);
  }, 2500);
}

function resetEdges() {
  if (graph.childElementCount > 1) {
    while (graph.childElementCount > 1) {
      graph.removeChild(graph.children[graph.childElementCount - 1]);
    }
    calcPathSection.classList.remove("d-flex");
    calcPathSection.classList.add("d-none");
  }
}
function edgeAlreadyAdded() {
  let edges = graph.children;
  for (let i = 1; i < graph.childElementCount; i++) {
    if (
      edges[i].children[1].textContent == fromSelector.value &&
      edges[i].children[2].textContent == toSelector.value
    ) {
      return true;
    } else if (
      edges[i].children[2].textContent == fromSelector.value &&
      edges[i].children[1].textContent == toSelector.value
    ) {
      return true;
    }
  }
  return false;
}
function addRemoveCalcSection() {
  if (graph.childElementCount > 1) {
    calcPathSection.classList.remove("d-none");
    calcPathSection.classList.add("d-flex");
  } else {
    calcPathSection.classList.remove("d-flex");
    calcPathSection.classList.add("d-none");
  }
}
function manageAddedCities(method, from, to) {
  if (method == "add") {
    let fromAdded = false;
    let toAdded = false;
    for (let i = 0; i < addedCities.length; i++) {
      if (addedCities[i] == from) {
        fromAdded = true;
      }
      if (addedCities[i] == to) {
        toAdded = true;
      }
    }
    if (!fromAdded) {
      addedCities.push(from);
      let option = document.createElement("option");
      option.value = from;
      option.textContent = from;
      startPointSelector.appendChild(option);
      endPointSelector.appendChild(option.cloneNode(true));
    }
    if (!toAdded) {
      addedCities.push(to);
      let option = document.createElement("option");
      option.value = to;
      option.textContent = to;
      startPointSelector.appendChild(option);
      endPointSelector.appendChild(option.cloneNode(true));
    }
  }
  if (method == "delete") {
    let edges = document.querySelectorAll(".graph .route:not(:first-child)");
    let startPoint = 0;
    let endPoint = 0;
    console.log(from);
    console.log(to);
    edges.forEach((edge) => {
      if (
        from == edge.children[1].textContent ||
        from == edge.children[2].textContent
      ) {
        startPoint++;
      }
      if (
        to == edge.children[1].textContent ||
        to == edge.children[2].textContent
      ) {
        endPoint++;
      }
    });
    console.log(startPoint);
    console.log(endPoint);
    if (startPoint < 1) {
      let toDelete;
      for (let i = 1; i < startPointSelector.children.length; i++) {
        if (startPointSelector.children[i].value == from) {
          toDelete = i;
          break;
        }
      }
      startPointSelector.removeChild(startPointSelector.children[toDelete]);
      endPointSelector.removeChild(endPointSelector.children[toDelete]);
    }
    if (endPoint < 1) {
      let toDelete;
      for (let i = 1; i < endPointSelector.children.length; i++) {
        if (endPointSelector.children[i].value == to) {
          toDelete = i;
        }
      }
      startPointSelector.removeChild(startPointSelector.children[toDelete]);
      endPointSelector.removeChild(endPointSelector.children[toDelete]);
    }
  }
}
function deleteEdge(target) {
  graph.removeChild(target.parentNode);
}
function createEdge() {
  let route = document.createElement("div");
  routeClasses.forEach((_class) => {
    if (_class == "d-none") {
      route.classList.add("d-flex");
    } else {
      route.classList.add(_class);
    }
  });
  let deleteBtn = document.createElement("span");
  deleteBtn.classList.add("delete-edge");
  deleteBtn.addEventListener("click", (e) => {
    let target = e.target.parentNode;
    deleteEdge(e.target);
    manageAddedCities(
      "delete",
      target.children[1].textContent,
      target.children[2].textContent
    );
    if (graph.childElementCount <= 1) {
      calcPathSection.classList.remove("d-flex");
      calcPathSection.classList.add("d-none");
    }
  });
  let fromNode = document.createElement("div");
  let toNode = document.createElement("div");
  fromNode.textContent = fromSelector.value;
  toNode.textContent = toSelector.value;
  fromNode.classList.add("from-node");
  toNode.classList.add("to-node");
  nodeClasses.forEach((_class) => {
    fromNode.classList.add(_class);
    toNode.classList.add(_class);
  });
  route.appendChild(deleteBtn);
  route.appendChild(fromNode);
  route.appendChild(toNode);
  graph.append(route);
  addRemoveCalcSection();
}
function resetAddedCities() {
  while (startPointSelector.children.length > 1) {
    startPointSelector.removeChild(
      startPointSelector.children[startPointSelector.children.length - 1]
    );
    endPointSelector.removeChild(
      endPointSelector.children[endPointSelector.children.length - 1]
    );
  }
}
function calcPath() {
  let jsonData = {};
  let jsonEdges = {};
  let jsonNodes = {};
  let edges = graph.children;
  for (let i = 1; i < edges.length; i++) {
    jsonEdges[i] = {
      from: edges[i].children[1].textContent,
      to: edges[i].children[2].textContent,
    };
  }
  let nodes = startPointSelector.children;
  for (let i = 1; i < nodes.length; i++) {
    jsonNodes[i] = nodes[i].value;
  }
  jsonData["edges"] = jsonEdges;
  jsonData["nodes"] = jsonNodes;
  let startPoint = startPointSelector.value;
  let endPoint = endPointSelector.value;
  if (startPoint !== endPoint) {
    jsonData["start"] = startPoint;
    jsonData["end"] = endPoint;
    return JSON.stringify(jsonData);
  } else {
    dropAlert("You Have To Choose Different Start And End Point");
  }
}

// Load Countries
const countrySelector = document.getElementById("country");
fetch("http://127.0.0.1:8000/getCountries/")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    data.forEach((country) => {
      console.log(country.country_name)
      let option = document.createElement("option");
      option.value = country.country_name;
      option.textContent = country.country_name;
      countrySelector.appendChild(option);
    });
  })
  .catch(function (ex) {
    console.log("parsing failed", ex);
  });

// Load Cities based on country
const fromSelector = document.getElementById("from");
const toSelector = document.getElementById("to");
fromSelector.disabled = true;
toSelector.disabled = true;

countrySelector.onclick = (e) => {
  if ((e.target.tagName === "OPTION") & (e.target.textContent !== "")) {
    fromSelector.disabled = false;
    toSelector.disabled = false;
    resetEdges();
    resetAddedCities();
    fetch(`http://127.0.0.1:8000/cities/${e.target.value}`)
      .then((response) => {
        data = response.json();
        return data;
      })
      .then((data) => {
        let optionsCount = document.getElementById("from").childElementCount;
        if (optionsCount > 1) {
          let options = document.getElementById("from").children;
          for (let i = 0; i <= optionsCount - 1; i++) {
            fromSelector.remove(options[i]);
            toSelector.remove(options[i]);
          }
          let emptyOption = document.createElement("option");
          fromSelector.appendChild(emptyOption);
          toSelector.appendChild(emptyOption.cloneNode(true));
          data.forEach((city) => {
            let option = document.createElement("option");
            option.value = city.name;
            option.textContent = city.name;
            toSelector.append(option);
            fromSelector.append(option.cloneNode(true));
          });
        } else {
          data.forEach((city) => {
            let option = document.createElement("option");
            option.value = city.name;
            option.textContent = city.name;
            toSelector.append(option);
            fromSelector.append(option.cloneNode(true));
          });
        }
      })
      .catch((er) => {
        console.log(er);
      });
  }
};

// Adding Edges
const graph = document.querySelector(".graph");
const addEdgeButton = document.querySelector(".add-edge button");
const routeClasses = document.querySelector(".route").classList;
const nodeClasses = document.querySelector(".route .node").classList;
const startPointSelector = document.getElementById("start");
const endPointSelector = document.getElementById("end");

let addedCities = [];
addEdgeButton.addEventListener("click", () => {
  if (countrySelector.value == "") {
    dropAlert("You Have To Choose A Country");
  } else if (
    (fromSelector.value == "" && toSelector.value == "") ||
    fromSelector.value == "" ||
    toSelector.value == ""
  ) {
    dropAlert("You Have To Choose Two Cities");
  } else if (fromSelector.value === toSelector.value) {
    dropAlert("You Have To Choose Two Different Cities");
  } else {
    if (edgeAlreadyAdded()) {
      dropAlert("Edge Have Been Already Added");
    } else {
      createEdge();
      manageAddedCities("add", fromSelector.value, toSelector.value);
    }
  }
});

// Calculate Path
const calcPathSection = document.querySelector(".calc-path");
const calcPathBtn = document.querySelector(".calc-path button");
calcPathBtn.addEventListener("click", () => {
  let h = document.getElementById("hidden");
  h.value = calcPath();
  console.log(h.value);
});
