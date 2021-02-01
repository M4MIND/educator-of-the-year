function selfRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var buffer = (function () {
    var _interface = {
        buffer: {},
        init: function () {
            this.buffer = localStorage.getItem("results")
                ? JSON.parse(localStorage.getItem("result"))
                : {};
        },
        add: function (group, data) {
            if (!this.buffer[group]) {
                this.buffer[group] = [];
            }

            this.buffer[group].push(data);

            localStorage.setItem("results", JSON.stringify(this.buffer));
        }
    };

    return _interface;
})();

var groups = (function () {
    var _interface = {
        collection: null,
        promise: null
    };

    _interface.promise = new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open("GET", "/static/groups.json");
        xhr.send();
        xhr.onload = function () {
            _interface.collection = JSON.parse(xhr.response);

            resolve(_interface);
        };
        xhr.onerror = function () {
            reject("Error");
        };
    });

    return _interface;
})();

var tasks = (function () {
    var _interface = {
        collection: null,
        promise: null
    };

    _interface.promise = new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open("GET", "/static/tasks.json");
        xhr.send();
        xhr.onload = function () {
            _interface.collection = JSON.parse(xhr.response);

            resolve(_interface);
        };
        xhr.onerror = function () {
            reject("Error");
        };
    });

    return _interface;
})();

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

                return this;
            },
            setActive: function (s) {
                if (s) {
                    this.e.classList.toggle("no-active", !s);
                    this.e.classList.toggle("active", s);
                } else {
                    this.e.classList.toggle("no-active", s);
                    this.e.classList.toggle("active", !s);
                }

                return this;
            },
            setNumber: function (d) {
                this.n.textContent = d;

                return this;
            },
            setTitle: function (d) {
                this.t.textContent = d;

                return this;
            },
            setTask: function (d) {
                this.z.textContent = d;

                return this;
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
        clearGroupsList: function () {
            this.listGroupsWrapper.innerHTML = "";
        },
        updateGroupsList: function (l) {
            this._groups = [];

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
        getGroupByIndex: _interface.getGroupByIndex.bind(_interface),
        clearGroupsList: _interface.clearGroupsList.bind(_interface)
    };
})();

var app = (function (w) {
    var groupCurrent = 0;
    var taskCurrent = 0;

    var CTA = {
        active: true,
        nums: [],
        e: document.getElementsByClassName("CTA")[0],
        click: function () {
            var _ = this;

            if (this.nums.length - 1 && this.active) {
                this.active = false;
                this.e.classList.add("active");

                var n = selfRandom(0, this.nums.length - 1);

                var e = render.getGroupByIndex(this.nums[n]);

                if (e) {
                    e.setActive(true)
                        .setTitle(
                            groups.collection[groupCurrent].participants[
                                8 - (this.nums.length - 1)
                            ].region
                        )
                        .setTask(
                            tasks.collection[taskCurrent][this.nums[n]].title +
                                " | " +
                                tasks.collection[taskCurrent][this.nums[n]].age
                        );

                    buffer.add(groups.collection[groupCurrent].title,
                        {
                            number: this.nums[n] + 1,
                            task:
                                tasks.collection[taskCurrent][this.nums[n]]
                                    .title,
                            group:
                                tasks.collection[taskCurrent][this.nums[n]].age,
                            region:
                                groups.collection[groupCurrent].participants[
                                    8 - (this.nums.length - 1)
                                ].region
                        }
                    );
                }

                this.updateNumber(this.nums[n]);

                this.nums.splice(n, 1);

                setTimeout(function () {
                    _.active = true;
                    _.e.classList.remove("active");
                    _.updateNumber('')
                }, 3000);
            } else if (this.active) {
                groupCurrent++;
                taskCurrent++;

                if (
                    groupCurrent < groups.collection.length &&
                    taskCurrent < tasks.collection.length
                ) {
                    render.clearGroupsList();
                    render.updateInfoGroupTitle(
                        groups.collection[groupCurrent].num
                    );
                    this.updateTasks(taskCurrent);
                    render.updateGroupsList(tasks.collection[taskCurrent]);
                } else {
                    render.clearGroupsList();
                }
            }
        },
        updateNumber: function (d) {
            this.e.getElementsByClassName("back")[0].textContent = d;
        },
        init: function () {
            this.e.addEventListener("click", this.click.bind(this));
            this.updateTasks(taskCurrent);
        },
        updateTasks: function (c) {
            this.nums = new Array(tasks.collection[c].length)
                .fill(1)
                .map(function (a, i) {
                    return i;
                });
        }
    };

    Promise.all([groups.promise, tasks.promise]).then(function (data) {
        render.updateInfoGroupTitle(groups.collection[groupCurrent].num);
        render.updateGroupsList(tasks.collection[taskCurrent]);

        CTA.init();
    });

    return {
        cta: CTA
    };
})(window);
