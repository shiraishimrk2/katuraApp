/*
motion_config:
ball_config
*/
phina.globalize();

//-------------firebase設定-----------------------------
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD9xlk-9hmoGWpGeuHXrqIZ3Tz14-jM1KM",
    authDomain: "webgame-a65e6.firebaseapp.com",
    databaseURL: "https://webgame-a65e6.firebaseio.com",
    projectId: "webgame-a65e6",
    storageBucket: "webgame-a65e6.appspot.com",
    messagingSenderId: "628612853374",
    appId: "1:628612853374:web:a9d86dfa6e22620322b22f",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const collection = db.collection("users");
//-------------------------------------------------------

var ASSETS = {
    image: {
        bg_top: 'img/title.png',
        katura: 'img/katura.png',
        'tutorial': 'img/tutorial.png',
        bat_bg: 'img/bat_bg.png',
        bg: 'img/office.png',
        bg2: 'img/office.png',
        animation: 'img/swing.png',
        bg_tuto: 'img/bg_tutorial.png',
        ranking: 'img/ranking.png',
        formimg: 'img/form.png'
    },
    spritesheet: {
        "animation_ss": {
            "frame": {
                "width": 155,
                "height": 188,
                "cols": 7,
                "rows": 1,
            },

            "animations": {
                "swing": {
                    "frames": [0, 1, 2, 3, 4, 5, 6, ],
                    "next": "",
                    "frequency": 3,
                },
            }
        },
    }
};

var SCREEN_WIDTH = screen.width;
var SCREEN_HEIGHT = screen.height;

var power_counter = 0;
var game_counter = 0;

phina.define("Title", {
    superClass: 'DisplayScene',
    init: function (option) {
        this.superInit(option);
        Sprite('bg_top', SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
        Label({
                text: "TOUCH START",
                fontSize: 20,
                fill: 'black',
            }).addChildTo(this)
            .setPosition(this.gridX.center(), this.gridY.span(13.5))
            .tweener.fadeOut(1000).fadeIn(500).setLoop(true).play();
        this.on('pointend', function () {
            var form = document.querySelector(".form");
            if (form.classList.contains("form") == true) {
                form.classList.remove("none");
                form.classList.add("addClass");
            }
            this.exit();
        });
    }
});

phina.define("Form", {
    superClass: 'DisplayScene',
    init: function (option) {
        this.superInit(option);
        Sprite('bg', SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

        var formimg = Formimg().addChildTo(this);
        formimg.x = this.gridX.center();
        formimg.y = this.gridY.center();
        formimg.width = 550;
        formimg.height = 300;

        var self = this;
        var form = document.querySelector(".addClass");

        //User登録
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            collection
                .add({
                    username: username.value, //フォーム入力されたものをpushする
                    score: 0,
                })
                .then((doc) => {
                    console.log(`${doc.id} added!`); //consoleで登録確認
                    localStorage.setItem("u-id", `${doc.id}`); //localstorageにID格納
                    localStorage.setItem("u-score", 0);
                })
                .catch((error) => {
                    console.log(error);
                });
            if (form.classList.contains("form") == true) {
                form.classList.remove("addClass");
                form.classList.add("none");
            }
            self.exit();
        });
    }
});

//5秒カウントアニメーションで表示させてみたら？

phina.define("TutorialScene", {
    superClass: 'DisplayScene',
    init: function (option) {
        this.superInit(option);
        this.bat_bg = Sprite("bg_tuto").addChildTo(this);
        this.bat_bg.origin.set(0, 0);

        var firebase = 0;
        if (firebase == 0) {
            var tutorial = Tutorial().addChildTo(this);
            tutorial.x = this.gridX.center();
            tutorial.y = this.gridY.center();
            tutorial.width = 550;
            tutorial.height = 300;

            tutorial.setInteractive(true);
            tutorial.onpointstart = function () {
                tutorial.remove();
            }
        };

        var background_box = RectangleShape({
            width: this.width * 2,
            height: this.height * 2,
            // fill: 'rgba(255, 255, 255, .4)',
            fill: 'transparent',
            stroke: 'transparent'
        }).addChildTo(this);

        // if()で今までのゲージをクリアしたか確認 yesならstart起動
        start();

        var timerId = 0;
        // var power_counter = 0;

        function start() {
            background_box.setInteractive(true);
            background_box.onpointstart = function () {
                for (let i = 0; i < 5; i++) {
                    power_counter++;
                };
                // 効果音をプラス
                console.log(power_counter);
                return this.power_counter;
            };
            timerId = setTimeout(stop, 5000);
        };

        var self = this;

        function stop() {
            background_box.setInteractive(false);
            clearTimeout(timerId);
            self.exit();
            // console.log(timerId);
            // move();
        };
    }
});


var tamesi_count = 0;
phina.define("Main", {
    superClass: 'DisplayScene',
    init: function (option) {
        this.superInit(option);

        // 背景
        this.bat_bg = Sprite("bat_bg").addChildTo(this);
        this.bat_bg.origin.set(0, 0);

        this.bg = Sprite("bg").addChildTo(this);
        this.bg.origin.set(0, 0); // 左上基準に変更
        this.bg.setPosition(SCREEN_WIDTH, 0)
        // ループ用の背景
        this.bg2 = Sprite("bg2").addChildTo(this);
        this.bg2.origin.set(0, 0); // 左上基準に変更
        this.bg2.setPosition(SCREEN_WIDTH * 2, 0);

        // ------------------------------------------------------------
        var animation = S_animation().addChildTo(this);
        animation.width = 155;
        animation.height = 188;

        var anim = FrameAnimation('animation_ss').attachTo(animation);
        anim.gotoAndPlay('swing');
        animation.x = 170;
        animation.y = 250;

        //---------------------------------------------------------------


        var background_box = RectangleShape({
            width: this.width * 2,
            height: this.height * 2,
            // fill: 'rgba(255, 255, 255, .4)',
            fill: 'transparent',
            stroke: 'transparent'
        }).addChildTo(this);

        // console.log(this);
        // if()で今までのゲージをクリアしたか確認 yesならstart起動
        start();

        // バックグラウンドでパワーの威力を決めるカウンター
        var timerId = 0;
        // var power_counter = 0;

        function start() {
            background_box.setInteractive(true);
            background_box.onpointstart = function () {
                for (let i = 0; i < 5; i++) {
                    power_counter++;
                };
                // 効果音をプラス
                console.log(power_counter);
                return this.power_counter;
            };
            timerId = setTimeout(stop, 5000);
        };

        function stop() {
            background_box.setInteractive(false);
            clearTimeout(timerId);
            // console.log(timerId);
            // move();
        }

        game_counter = 0;

        var n_canvas = document.createElement('canvas');
        n_canvas.classList.add('canvas');
        n_canvas.width = SCREEN_WIDTH;
        n_canvas.height = SCREEN_HEIGHT;
        document.body.appendChild(n_canvas);

        var tamesi_List = document.querySelectorAll('canvas');
        tamesi_List[0].classList.add('p_canvas');

        function motionAnime(canvas, canvas_config, motionFunc, motion_config, outside_process) {
            var canvas = document.querySelector('.canvas');
            var ctx = canvas.getContext('2d');

            if (!canvas) {
                console.log('wrong canvas_id');
                return false;
            }

            if (!motion_config.ball_config) {
                console.log('Not ball_config in motion_config.');
                return false;
            }

            // // 1 canvasの座標の原点を左上から左下へ移動、およびy軸反転
            canvasInitialize(canvas);

            function canvasInitialize(canvas) {
                ctx.translate(0, canvas.height);
                ctx.scale(1, -1);
            }

            // ball位置初期化
            motion_config.ball_config.ball_pos = {
                x: motion_config.ball_config.ball_pos0.x,
                y: motion_config.ball_config.ball_pos0.y
            }

            //時間
            motion_config.t = motion_config.t0;

            // アニメ~ション
            setInterval(anime, motion_config.interval_s * 50);

            function anime() {
                //消去
                canvasReset(canvas, canvas_config);

                // 3白のボールを描画
                drawBall(ctx, motion_config);

                // 4 計算
                motion_config.ball_config.ball_pos = motionFunc(motion_config);
                motion_config.t += motion_config.interval_s;

                // はみ出しの時の処理
                if (outside_process) {
                    outside_process(canvas, motion_config);
                }

                function canvasReset(canvas, canvas_config) {
                    ctx.globalAlpha = canvas_config.globalAlpha;
                    ctx.fillStyle = canvas_config.fillStyle;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                function drawBall(ctx, motion_config) {
                    ctx.globalAlpha = motion_config.ball_config.globalAlpha;
                    ctx.beginPath();
                    ctx.arc(motion_config.ball_config.ball_pos.x, motion_config.ball_config.ball_pos.y, motion_config.ball_config.r, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fillStyle = motion_config.ball_config.fillStyle;
                    ctx.fill();
                }
            }
        }
        (function () {
            var obliqueProjectionAnime = function (canvas, canvas_config, motion_config, outside_process) {
                motionAnime(canvas, canvas_config, obliqueProjection, motion_config, outside_process);

                function obliqueProjection(motion_config) {
                    var ball_pos = { //初期化
                        x: 180,
                        y: 10
                    };
                    ball_pos.x = motion_config.ball_config.ball_pos0.x + motion_config.v0 * Math.cos(motion_config.deg * Math.PI / 180) * motion_config.t;
                    ball_pos.y = motion_config.ball_config.ball_pos0.y + motion_config.v0 * Math.sin(motion_config.deg * Math.PI / 180) * motion_config.t - 0.5 * motion_config.g * Math.pow(motion_config.t, 2) * motion_config.t;

                    // console.log(ball_pos);
                    return ball_pos;
                }
            };
            obliqueProjectionAnime('canvas', {
                    // globalAlpha: 5,透明軌跡
                    fillStyle: 'transparent'
                }, {
                    ball_config: {
                        fillStyle: 'black',
                        // globalAlpha: 1,
                        r: 5,
                        ball_pos0: // 初期位置
                        {
                            x: 180,
                            y: 10,
                        },
                    },
                    v0: this.power_counter * 2,
                    g: 9.8, //重力加速度
                    deg: 50, //打ち出し角度
                    interval_s: 0.02, //50 msごとに描画
                    t0: 0, //初期時間
                    t: 0,
                    e: 0.8,
                    result: 0
                },
                // console.log(canvas.v0),
                function (canvas, motion_config) {
                    // 画面動かす
                    // if (motion_config.ball_config.ball_pos.x > canvas.width / 2) {
                    //     var tamesi = canvas.getContext('2d');
                    //     tamesi.translate(-0.4, 0);
                    // }

                    //ボールが着地したらバウンド
                    if (motion_config.ball_config.ball_pos.y < 10) {
                        motion_config.t = 0;
                        motion_config.ball_config.ball_pos0.x = motion_config.ball_config.ball_pos.x;

                        motion_config.v0 = -(motion_config.v0 * motion_config.e);
                        // console.log(motion_config.v0);
                        return motion_config.v0;
                    }

                    // var tamesi = Math.pow(motion_config.ball_config.ball_pos.v0, 2) / motion_config.ball_config.ball_pos.g * Math.sin(2 * motion_config.ball_config.ball_pos.deg) * Math.cos(motion_config.ball_config.ball_pos.deg);
                    // console.log(tamesi);
                    if (motion_config.result == 0) {
                        motion_config.result = Math.floor(Math.pow(motion_config.v0, 2) / 9.8 * Math.sin(2 * motion_config.deg * (Math.PI / 180)));
                        // console.log(motion_config.result);
                        return motion_config.result;
                    }
                    var aaa = motion_config.result;
                    //更新用判別処理
                    var result_score = aaa;
                    var localscore = localStorage.getItem("u-score");
                    if (localscore < result_score) {
                        collection.doc(localStorage.getItem("u-id")).update({
                            score: result_score,
                        });
                        localStorage.setItem("u-score", result_score);
                    }
                    // else {
                    //     console.log("追加されませんでした");
                    // };

                });
        })();
        var self = this;
        Button({
            text: '➡',
            fontSize: 13,
            width: 50,
            height: 50,
            fill: 'gray'
        }).addChildTo(this).setPosition(this.gridX.span(15), this.gridY.span(14.5)).onpush = function () {
            n_canvas.remove();
            self.exit();
        };
    },

    // update: function (app) {
    //     this.bat_bg.x -= 1;
    //     this.bg.x -= 1;
    //     this.bg2.x -= 1;
    //     if (this.bg.x <= -SCREEN_WIDTH) {
    //         this.bg.x = 0;
    //         this.bg2.x = SCREEN_WIDTH;
    //     }
    // }
});

phina.define("Formimg", {
    superClass: 'Sprite',
    init: function () {
        this.superInit('formimg');
    }
});


phina.define("Tutorial", {
    superClass: 'Sprite',
    init: function () {
        this.superInit('tutorial');
    }
});

phina.define("S_animation", {
    superClass: 'Sprite',
    init: function () {
        this.superInit('animation')
    }
});

phina.define("Result", {
    superClass: 'DisplayScene',
    init: function (option) {
        this.superInit(option);
        this.ranking = Sprite("ranking").addChildTo(this);
        this.ranking.origin.set(-0.08, -0.1);

        //ランキング表示
        collection
            .limit(10)
            .orderBy("score", "desc")
            .get()
            .then((onSnapshot) => {
                var number = 1;
                onSnapshot.forEach((doc, i) => {
                    var data = doc.data();
                    var ranking = number++;
                    var all_ran_n = ranking;
                    var all_ran_t = `${data.username}    Score : ${data.score}`;
                    var all_ranking = all_ran_n + "   " + all_ran_t;
                    //ランクインか判別して色を変更する
                    var you_id = localStorage.getItem("u-id");
                    if (you_id == `${doc.id}`) {
                        Label({
                                text: all_ranking,
                                fontSize: 16,
                                fontWeight: "bold",
                                fill: "red",
                                align: "left",
                            })
                            .addChildTo(this)
                            .setPosition(200, 45 + number * 21);
                    } else {
                        Label({
                                text: all_ranking,
                                fontSize: 16,
                                fill: "black",
                                align: "left",
                            })
                            .addChildTo(this)
                            .setPosition(200, 45 + number * 21);
                    }
                });
            })
            .catch((error) => {
                console.log(`データの取得に失敗しました (${error})`);
            });
        //自分の順位を出す処理
        var your_score = localStorage.getItem("u-score");
        // var your_score = 23456;
        var num = parseInt(your_score);
        collection
            .where("score", ">", num)
            .get()
            .then((snap) => {
                var y_ran_msg1 = "貴方は";
                var y_ran_msg2 = "位です";
                var y_ran_msg = y_ran_msg1 + (size = snap.size + 1) + y_ran_msg2;
                Label({
                        text: y_ran_msg,
                        fontSize: 18,
                        fill: "black",
                    })
                    .addChildTo(this)
                    .setPosition(230, 305);
            });
        //自分のスコアを表示する
        var docRef = db.collection("users").doc(localStorage.getItem("u-id"));
        docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    var data = doc.data();
                    var ttt = `${data.username}, score:${data.score}`;
                    Label({
                            text: ttt,
                            fontSize: 18,
                            fill: "black",
                        })
                        .addChildTo(this)
                        .setPosition(400, 305);
                } else {
                    console.log("404");
                }
            })
            .catch((error) => {
                console.log(`データを取得できませんでした (${error})`);
            });

        var self = this;
        Button({
            text: '➡',
            fontSize: 13,
            width: 50,
            height: 50,
            fill: 'gray'
        }).addChildTo(this).setPosition(this.gridX.span(15), this.gridY.span(14.5)).onpush = function () {
            self.exit();
        };
    }
});

phina.main(function () {
    var app = GameApp({
        // query: '#canvas',
        // Start から開始
        startLabel: 'title',
        fit: false,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        assets: ASSETS,
        // width,height問題
        // fps: 500,
        scenes: [{
                className: 'Title',
                label: 'title',
                nextLabel: 'form'
            },
            {
                className: 'Form',
                label: 'form',
                nextLabel: 'tutorialscene',
            },
            {
                className: 'TutorialScene',
                label: 'tutorialscene',
                nextLabel: 'main',
            },
            {
                className: 'Main',
                label: 'main',
                nextLabel: 'result',
            },
            {
                className: 'Result',
                label: 'result',
                nextLabel: 'title',
            },

        ]
    });
    // 実行
    app.run();
});