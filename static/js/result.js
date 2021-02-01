var theadListKeys = [
    '#',
    'Задание',
    'Группа',
    'Регион'
]

var tbodyListKeys = [
    'number',
    'task',
    'group',
    'region'
]

var main = (function () {
    var items = localStorage.getItem("results")
        ? JSON.parse(localStorage.getItem("results"))
        : null;

    if (items) {
        for (var i = 0; i < Object.keys(items).length; i++) {
            var k = Object.keys(items)[i];
            var t = document.createElement("h3");
            t.innerText = k;

            var table = document.createElement("table");
            var thead = document.createElement("thead");
            var tbody = document.createElement("tbody");

            for (var th = 0; th < theadListKeys.length; th++) {
                thead.appendChild(document.createElement("th"));
                thead.childNodes[th].textContent = theadListKeys[th]
            }

            table.appendChild(thead);
            table.appendChild(tbody);

            document.body.getElementsByClassName('container')[0].appendChild(t);
            document.body.getElementsByClassName('container')[0].appendChild(table);

            for (var t = 0; t < items[k].length; t++) {
                var rs = items[k][t];
                var tr = document.createElement('tr');

                for (var rsi = 0; rsi < Object.keys(rs).length; rsi ++) {
                    tr.appendChild(document.createElement('td'));
                    tr.childNodes[rsi].textContent = rs[tbodyListKeys[rsi]]
                }

                tbody.append(tr);
            }
        }
    }
})();
