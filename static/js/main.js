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

/* 



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

 */

 var groupInfo = (function() {
    var _interface = {
        e: document.getElementsByClassName('group-number')[0],
        setNumber: function(d) {
            this.e.textContent = d; 
        }
    }

    return _interface;
 })();

var members = (function () {
    var _interface = {
        collection: [],
        e: document.getElementsByClassName("timeline")[0],
        add: function (title, number) {
            this.collection.push(member());

            this.collection[this.collection.length - 1].setTitle(title);
            this.collection[this.collection.length - 1].setNumber(number);
            this.e.appendChild(this.collection[this.collection.length - 1].e);

            return this.collection[this.collection.length - 1];
        },
        getByIndex: function (i) {
            return this.collection[i];
        },
        clear: function (callback) {
            for (var i = 0; i < this.collection.length; i++) {
                this.collection[i].remove();
            }

            setTimeout(function () {
                _interface.collection = [];
                callback();
            }, 500);
        }
    };

    var member = function () {
        var _panel = function () {
            var _ = {
                active: false,
                e: document.createElement("div"),
                t: document.createElement("h6"),
                n: document.createElement("h1"),

                create: function () {
                    this.e.appendChild(this.t);
                    this.e.appendChild(this.n);

                    this.e.classList.add("panel");
                    this.t.classList.add("title");
                    this.n.classList.add("number");

                    return this;
                },
                setTitle: function (d) {
                    this.t.textContent = d;

                    return this;
                },
                setNumber: function (d) {
                    this.n.textContent = d;

                    return this;
                },
                setActive: function (d) {
                    setTimeout(function () {
                        _.e.classList.toggle("active", d);
                    });

                    return this;
                },
                remove: function (callback) {
                    _.setActive(false);

                    setTimeout(function () {
                        _.e.remove();
                        callback();
                    }, 500);
                }
            };

            return _.create();
        };

        var _ = {
            e: document.createElement("li"),
            b: document.createElement("div"),
            p: _panel(),
            create: function () {
                this.e.appendChild(this.b);
                this.e.appendChild(this.p.e);

                this.e.classList.add("item");
                this.b.classList.add("budget");

                return this;
            },
            setTitle: function (d) {
                this.p.setTitle(d);

                return this;
            },
            setNumber: function (d) {
                this.p.setNumber(d);

                return this;
            },
            remove: function () {
                this.p.remove(function () {
                    _.e.remove();
                });
            }
        };

        return _.create();
    };

    return _interface;
})();

var _cta = (function () {
    var _interface = {
        active: true,
        e: document.getElementsByClassName("cta")[0],
        click: function (callback) {
            this.e.addEventListener("click", function () {
                if (_interface.active) {
                    _interface.active = false;
                    _interface.e.classList.toggle("active", !_interface.active)
                    setTimeout(function () {
                        _interface.active = true;
                        _interface.e.classList.toggle("active", !_interface.active)
                    }, 1500);
                    callback();
                }
            });
        }
    };

    return _interface;
})();

var container = (function () {
    return {
        e: document.getElementsByClassName("container")[0],
        setActive: function (d) {
            this.e.classList.toggle("active", d);
        }
    };
})();

var _app = (function () {
    var _interface = {
        count: 0,
        groupCount: 0,
        init: function () {
            Promise.all([groups.promise, tasks.promise])
                .then(function (d) {
                    _interface.run();
                })
                .catch(function (e) {
                    alert("Ошибка");
                    console.error(e);
                });
        },
        run: function () {
            _cta.click(function () {
                if (
                    _interface.count <
                    groups.collection[_interface.groupCount].participants.length
                ) {
                    var n = selfRandom(
                        0,
                        tasks.collection[_interface.groupCount].length - 1
                    );
                    var result = tasks.collection[_interface.groupCount][n];
                    var region = groups.collection[_interface.groupCount].participants[_interface.count];

                    tasks.collection[_interface.groupCount].splice(n, 1);

                    members
                        .getByIndex(_interface.count)
                        .p.setTitle(result.title)
                        .setNumber(result.num)
                        .setActive(true);

                    buffer.add(groups.collection[_interface.groupCount].title,
                        {
                            number: n + 1,
                            task: result.title,
                            group: result.age,
                            region: region.region,
                            name: region.name
                        }
                    )

                    _interface.count++;
                } else {
                    _interface.groupCount++;

                    if (groups.collection[_interface.groupCount]) {
                        _interface.count = 0;
                        members.clear(function () {
                            for (
                                var i = 0;
                                i <
                                groups.collection[_interface.groupCount]
                                    .participants.length;
                                i++
                            ) {
                                members.add();
                            }

                            groupInfo.setNumber(groups.collection[_interface.groupCount].num)
                        });
                        
                    } else {
                        container.setActive(false);
                    }
                }
            });

            for (
                var i = 0;
                i < groups.collection[this.groupCount].participants.length;
                i++
            ) {
                members.add();
            }

            groupInfo.setNumber(groups.collection[this.groupCount].num)

            container.setActive(true);
        }
    };

    _interface.init();

    return _interface;
})();
