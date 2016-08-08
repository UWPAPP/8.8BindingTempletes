// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509

(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;
	var isFirstActivation = true;

	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.voiceCommand) {
			// TODO: Handle relevant ActivationKinds. For example, if your app can be started by voice commands,
			// this is a good place to decide whether to populate an input field or choose a different initial view.
		}
		else if (args.detail.kind === activation.ActivationKind.launch) {
			// A Launch activation happens when the user launches your app via the tile
			// or invokes a toast notification by clicking or tapping on the body.
			if (args.detail.arguments) {
				// TODO: If the app supports toasts, use this value from the toast payload to determine where in the app
				// to take the user in response to them invoking a toast notification.
			}
			else if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
				// TODO: This application had been suspended and was then terminated to reclaim memory.
				// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
				// Note: You may want to record the time when the app was last suspended and only restore state if they've returned after a short period.
			}
		}

		if (!args.detail.prelaunchActivated) {
			// TODO: If prelaunchActivated were true, it would mean the app was prelaunched in the background as an optimization.
			// In that case it would be suspended shortly thereafter.
			// Any long-running operations (like expensive network or disk I/O) or changes to user state which occur at launch
			// should be done here (to avoid doing them in the prelaunch case).
			// Alternatively, this work can be done in a resume or visibilitychanged handler.
		}

		if (isFirstActivation) {
			// TODO: The app was activated and had not been running. Do general startup initialization here.
			document.addEventListener("visibilitychange", onVisibilityChanged);
			args.setPromise(WinJS.UI.processAll());
		}

		isFirstActivation = false;
	};

	function onVisibilityChanged(args) {
		if (!document.hidden) {
			// TODO: The app just became visible. This may be a good time to refresh the view.
		}
	}

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
	};

	app.start();



    
	var toCssColor = WinJS.Binding.initializer(
        function toCssColor(source, sourceProperty, dest, destProperty) {
            //设置目标的背景色
            function setBackColor() {
                dest.style.backgroundColor = rgb(source.color.r, source.color.g, source.color.b);
            }

            function rgb(r, g, b) {
                return "rgb(" + r + "," + g + "," + b + ")";
            }

            //当color属性发生改变的时候执行setBackColor方法
            return WinJS.Binding.bind(source, {
                color: {
                    r: setBackColor,
                    g: setBackColor,
                    b: setBackColor,
                }
            });
        }
    );

    //定义一个NameSpace
	WinJS.Namespace.define("TemplateControl", {
	    toCssColor: toCssColor
	});

    //DataSource 所有属性都可以绑定(observable)
	var DataSource = WinJS.Binding.define({
	    text: "",
	    color: { r: 0, g: 0, b: 0 }
	});

    //数据源
	var sourceObjects = [
        new DataSource({ text: "First object", color: { r: 68, g: 34, b: 88 } }),
        new DataSource({ text: "Second object", color: { r: 68, g: 34, b: 64 } }),
        new DataSource({ text: "Third object", color: { r: 68, g: 34, b: 40 } })
	];

    // 数据源中第一条数据
	var dataSource = sourceObjects[0];

	var prefix;
	var textBox;
	var redTextBox;
	var greenTextBox;
	var blueTextBox;


    //给文本输入框绑定事件,当值发生改变后重新设置数据源中的数据
	function bindInputs() {
	    textBox.addEventListener("change", function (evt) {
	        dataSource.text = textBox.value;
	    }, false);

	    redTextBox.addEventListener("change", function () {
	        dataSource.color.r = redTextBox.value;
	    }, false);

	    greenTextBox.addEventListener("change", function () {
	        dataSource.color.g = greenTextBox.value;
	    }, false);

	    blueTextBox.addEventListener("change", function () {
	        dataSource.color.b = blueTextBox.value;
	    }, false);

	    updateInputs();
	}

	function updateInputs() {
	    textBox.value = dataSource.text;
	    redTextBox.value = dataSource.color.r;
	    greenTextBox.value = dataSource.color.g;
	    blueTextBox.value = dataSource.color.b;
	}

    //当select控件选择的数据发生改变时调用
	function sourceObjectChange(eventObject) {
	    dataSource = sourceObjects[eventObject.target.selectedIndex];
	    updateInputs();
	}


	WinJS.UI.processAll().then(function () {
	    prefix = "#templateControlInput";

	    textBox = document.querySelector(prefix + "TextInput");
	    redTextBox = document.querySelector(prefix + "Red");
	    greenTextBox = document.querySelector(prefix + "Green");
	    blueTextBox = document.querySelector(prefix + "Blue");

        //给select控件注册事件
	    document.querySelector("#templateControlObjectSelector")
            .addEventListener("change", sourceObjectChange, false);

	    //绑定文本框事件
	    bindInputs();

	    //查找到模板
	    var templateControl = document.querySelector("#templateControlTemplate").winControl;

	    //查到到将要渲染的控件
	    var renderHere = document.querySelector("#templateControlRenderTarget");

	    //遍历数据源
        //o 为数据
	    sourceObjects.forEach(function (o) {
	        //将o中的数据render到templateControl中
	        //render 绑定数据
	        templateControl.render(o).then(function (e) {
	            //e为element，将e拼接到renderHere控件中
	            renderHere.appendChild(e);
	        });

            //第二种写法
	        //templateControl.render(o, renderHere).then(function (e) {
	        //});
	    });
	});


})();
