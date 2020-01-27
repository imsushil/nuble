/* Timer class
 * It updates and displays the time.
 */
export class Timer {
	intervalId = 0;
	constructor(){
		this.hoursLabel = document.getElementById("hours");
		this.minutesLabel = document.getElementById("minutes");
		this.secondsLabel = document.getElementById("seconds");
		this.totalSeconds = 0;
		this.start();
	}

	start() {
		clearInterval(Timer.intervalId);
		Timer.intervalId = setInterval(this.setTime.bind(this), 1000);
	}

	stop() {
		clearInterval(Timer.intervalId);
	}

	setTime() {
		++this.totalSeconds;
		this.secondsLabel.innerHTML = this.pad(this.totalSeconds % 60);
		this.minutesLabel.innerHTML = this.pad(parseInt((this.totalSeconds%(60*60)) / 60));
		this.hoursLabel.innerHTML = this.pad(parseInt(this.totalSeconds / (60*60)));
	}

	pad(val) {
		var valString = val + "";
		if (valString.length < 2) {
			return "0" + valString;
		} else {
			return valString;
		}
	}
}