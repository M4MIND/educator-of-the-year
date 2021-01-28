function selfRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var fs = (function() {
    var _interface = {
        buffer: [],
    }
    return {
        addRow: function(d) {
            console.log(d);
            _interface.buffer.push(unescape(encodeURIComponent(d)))
        },
        getRow: function() {
            var type = 'data:application/plain;content-disposition=attachment;filename=test.txt;base64, ';
            var text = _interface.buffer.join('\n');
            return type + btoa(text);
        }
    }
})();

var collection = (function (w) {
    return {
        groups: [
            "Регион 1",
            "Регион 2",
            "Регион 3",
            "Регион 4",
            "Регион 5",
            "Регион 6",
            "Регион 7",
            "Регион 8",
            "Регион 9"
        ],
        data: [
            {
                title: "VI",
                variants: [
                    {
                        title: "Зима в городе",
                        group: "Старшая группа"
                    },
                    {
                        title: "Зимние игры и забавы. Зимние хлопоты",
                        group: "Подготовительная группа"
                    },
                    {
                        title: "Азбука безопасности.",
                        group: "Старшая группа"
                    },
                    {
                        title: "Миром правит доброта",
                        group: "Подготовительная группа"
                    },
                    {
                        title: "Россия и ее соседи",
                        group: "Старшая группа"
                    },
                    {
                        title: "Наша планета (страны и континенты)",
                        group: "Подготовительная группа"
                    },
                    {
                        title:
                            'Мир профессий "Все профессии нужны, все профессии важны"',
                        group: "Старшая группа"
                    },
                    {
                        title: "Наша планета (страны и континенты)",
                        group: "Подготовительная группа"
                    },
                    {
                        title: "Миром правит доброта",
                        group: "Подготовительная группа"
                    }
                ]
            }
        ]
    };
})(window);

var render = (function () {
    var group = function (n, t) {
        var _interface = {
            e: document.createElement("div"),
            n: document.createElement("a"),
            t: document.createElement("div"),
            w: document.createElement("div"),
            z: document.createElement("div"),
            init: function () {
                this.e.appendChild(this.n);
                this.e.appendChild(this.w);
                this.w.appendChild(this.t);
                this.w.appendChild(this.z);

                this.e.classList.add("group", "no-active");
                this.n.classList.add("number");
                this.t.classList.add("title");
                this.w.classList.add("wrapper");
                this.z.classList.add("task");

                var _ = this;

                this.n.addEventListener('click', function(e) {
                    _.n.download = 'result.txt';
                    _.n.href=fs.getRow();

                })
            },
            setActive: function (s) {
                if (s) {
                    this.e.classList.toggle("no-active", !s);
                    this.e.classList.toggle("active", s);
                } else {
                    this.e.classList.toggle("no-active", s);
                    this.e.classList.toggle("active", !s);
                }
            },
            setNumber: function (d) {
                this.n.textContent = d;
            },
            setTitle: function (d) {
                this.t.textContent = d;
            },
            setTask: function (d) {
                this.z.textContent = d;
            }
        };

        if (n) {
            _interface.setNumber(n);
        }

        if (t) {
            _interface.setTitle(t);
        }

        _interface.init();

        return _interface;
    };

    var _interface = {
        _groups: [],
        groupWrapper: document
            .getElementsByClassName("info-bar")[0]
            .getElementsByClassName("group")[0],
        listGroupsWrapper: document.getElementsByClassName("list-group")[0],
        updateGroupsList: function (l) {
            for (var i = 0; i < l.length; i++) {
                this._groups.push(group(i + 1, l[i].group));
                this.listGroupsWrapper.appendChild(this._groups[i].e);
            }
        },
        updateInfoGroupTitle: function (d) {
            this.groupWrapper.getElementsByClassName(
                "number"
            )[0].textContent = d;
        },
        getGroupByIndex: function (n) {
            return this._groups[n];
        },
        draw: function () {},
        update: function () {}
    };

    return {
        update: _interface.update.bind(_interface),
        updateInfoGroupTitle: _interface.updateInfoGroupTitle.bind(_interface),
        updateGroupsList: _interface.updateGroupsList.bind(_interface),
        getGroupByIndex: _interface.getGroupByIndex.bind(_interface)
    };
})();

var app = (function (w) {
    render.updateInfoGroupTitle(collection.data[0].title);
    render.updateGroupsList(collection.data[0].variants);

    var nums = new Array(collection.data[0].variants.length)
        .fill(1)
        .map(function (a, i) {
            return i;
        });

    var current = 0;

    var CTA = {
        active: true,
        e: document.getElementsByClassName("CTA")[0],
        click: function () {
            if (nums.length > 0 && CTA.active) {
                this.e.classList.add("active");
                this.active = false;
                var n = selfRandom(0, nums.length - 1);
                var _n = nums[n];

                var e = render.getGroupByIndex(_n);

                if (e) {
                    e.setActive(true);
                    e.setTitle(collection.groups[current]);
                    e.setTask(
                        collection.data[0].variants[_n].title +
                            " (" +
                            collection.data[0].variants[_n].group +
                            ")"
                    );
                }

                nums.splice(n, 1);
                CTA.updateNumber(_n + 1);

                fs.addRow(_n + 1 + ": " + collection.groups[current] + " : " + collection.data[0].variants[_n].title + " | " + collection.data[0].variants[_n].group )

                setTimeout(function () {
                    CTA.active = true;
                    CTA.e.classList.remove("active");
                    CTA.updateNumber("");
                }, 3000);

                current ++;
            }
        },
        updateNumber: function (d) {
            this.e.getElementsByClassName("back")[0].textContent = d;
        },
        init: function () {
            this.e.addEventListener("click", this.click.bind(this));
        }
    };

    CTA.init();

    return {
        cta: CTA
    };
})(window);
