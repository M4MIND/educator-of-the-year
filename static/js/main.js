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

var groupInfo = (function () {
    var _interface = {
        e: document.getElementsByClassName('group-number')[0],
        setNumber: function (d) {
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
                    this.t.innerHTML = d;

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
            n: document.createElement("div"),
            p: _panel(),
            active: false,
            create: function () {
                this.e.appendChild(this.b);
                this.b.appendChild(this.n);
                this.e.appendChild(this.p.e);

                this.e.classList.add("item");
                this.b.classList.add("budget");
                this.n.classList.add("number");

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
            },
            setNumberBudget: function (d) {
                this.n.textContent = d;
            },
            setActive: function (s) {
                this.active = s;

                this.e.classList.toggle('active', this.active);

                return this;
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
        b: document.getElementsByClassName("cta")[0].getElementsByClassName("back")[0],
        changeNumber: function (d) {
            this.b.textContent = d;
        },
        click: function (callback, _callback) {
            this.e.addEventListener("click", function () {
                if (_interface.active) {
                    _interface.active = false;
                    _interface.e.classList.toggle("active", !_interface.active)
                    setTimeout(function () {
                        _interface.active = true;
                        _interface.e.classList.toggle("active", !_interface.active)
                        _callback();
                    }, 1500);
                    callback();
                }
            });
        }
    };

    return _interface;
})();


var groupListContainer = (function () {
    var _p = function () {
        var _ = {
            e: document.createElement('li'),
            setTitle: function (d) {
                this.e.textContent = d;
            },
            init: function () {
                this.e.classList.add('test');
            },
            remove: function () {
                this.e.remove();
            }
        }

        _.init();

        return _;
    }

    return {
        e: document.getElementsByClassName('group-info-list')[0],
        collection: [],
        clear: function () {
            return this;
        },
        add: function () {
            this.collection.push(_p());

            this.e.appendChild(this.collection[this.collection.length - 1].e);

            return this.collection[this.collection.length - 1];
        },
        removeByIndex: function (i) {
            this.collection[i].remove();
            this.collection.splice(i, 1);
        }
    }
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
        mebers: [],
        init: function () {
            Promise.all([groups.promise, tasks.promise])
                .then(function (d) {
                    _interface.run();
                })
                .catch(function (e) {
                    alert("Ошибка, не удалось загрузить файлы group.json tasks.json");
                    console.error(e);
                });
        },
        run: function () {
            _cta.click(function () {
                if (
                    _interface.count <
                    groups.collection[_interface.groupCount].participants.length
                ) {
                    // Random position
                    var m = selfRandom(0, _app.mebers.length - 1)
                    var memberPosition = _app.mebers[m];

                    _app.mebers.splice(m, 1);

                    // Random task
                    var n = selfRandom(
                        0,
                        tasks.collection[_interface.groupCount].length - 1
                    );
                    var result = tasks.collection[_interface.groupCount][n];
                    var region = groups.collection[_interface.groupCount].participants[_interface.count];

                    groupListContainer.removeByIndex(0);

                    _cta.changeNumber(memberPosition + 1)

                    tasks.collection[_interface.groupCount].splice(n, 1);
                    _app.mebers.slice(m, 1);

                    members
                        .getByIndex(memberPosition)
                        .setActive(true)
                        .p.setTitle("<b>" + region + "</b></br><span>Тема " + result.num.split('-')[1] + ": " + result.title + " - " + result.age + "</span>")
                        .setActive(true);

                    buffer.add(groups.collection[_interface.groupCount].title,
                        {
                            number: result.num,
                            task: result.title,
                            age: result.age,
                            region: region,
                        }
                    )

                    _interface.count++;
                } else {
                    _interface.groupCount++;

                    container.setActive(false);

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
                                members.add().setNumberBudget(i + 1);
                                _app.mebers.push(i);
                                groupListContainer.add().setTitle(groups.collection[_interface.groupCount].participants[i])
                            }

                            groupInfo.setNumber(groups.collection[_interface.groupCount].num)

                        });


                        setTimeout(function () {
                            container.setActive(true);
                        }, 2000)
                    } else {
                        container.setActive(false);
                        alert('Жеребьевка завершена')
                    }
                }
            }, function () {
                _cta.changeNumber('')
            });

            for (
                var i = 0;
                i < groups.collection[this.groupCount].participants.length;
                i++
            ) {
                members.add().setNumberBudget(i + 1);
                _app.mebers.push(i);
                groupListContainer.add().setTitle(groups.collection[this.groupCount].participants[i])
            }

            groupInfo.setNumber(groups.collection[this.groupCount].num)

            container.setActive(true);
        }
    };

    _interface.init();

    return _interface;
})();
