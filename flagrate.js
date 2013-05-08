/*!
 * Flagrate
 *
 * Copyright (c) 2013 Yuki KAN and Flagrate Contributors
 * Licensed under the MIT-License.
 *
 * https://github.com/kanreisa/flagrate
**/
(function _flagrate() {
	
	"use strict";
	
	// flagrate global scope
	if (typeof window.flagrate !== 'undefined') {
		throw new Error('[conflict] flagrate is already defined.');
	}
	
	var flagrate = window.flagrate = {};
	
	flagrate.className = 'flagrate';
	
	// deep copy a object
	var objectCloner = flagrate.objectCloner = function _objectCloner(object) {
		return JSON.parse(JSON.stringify(object));
	};
	
	/*?
	 * Notify
	**/
	var Notify = flagrate.Notify = function _Notify(opt) {
		
		if (!opt) var opt = {};
		
		this.target    = opt.target    || document.body;
		this.className = opt.className || flagrate.className + ' ' + flagrate.className + '-notify';
		
		this.disableDesktopNotify = opt.disableDesktopNotify || false;//Notification API(experimental)
		
		this.hAlign  = opt.hAlign  || 'right';
		this.vAlign  = opt.vAlign  || 'bottom';
		this.hMargin = opt.hMargin || 10;//pixels
		this.vMargin = opt.vMargin || 10;//pixels
		this.spacing = opt.spacing || 10;//pixels
		this.timeout = opt.timeout || 5;//seconds
		
		this.title   = opt.title   || 'Notify';
		
		this.notifies = [];
		
		if (this.disableDesktopNotify === false) {
			this.desktopNotifyType = null;
			
			/*- Check supported -*/
			if (typeof window.webkitNotifications !== 'undefined') {
				this.desktopNotifyType = 'webkit';
			}
			
			if (this.desktopNotifyType === null) {
				this.disableDesktopNotify = true;
			}
			
			/*- Get Permissions -*/
			if ((this.desktopNotifyType === 'webkit') && (window.webkitNotifications.checkPermission() !== 0)) {
				this.create({
					text   : 'Click here to activate desktop notifications...',
					onClick: function() {
						window.webkitNotifications.requestPermission();
					}.bind(this)
				});
			}
		}
		
		return this;
	};
	
	Notify.prototype = {
		create: function _create(opt) {
			
			/*- Desktop notify -*/
			if (this.disableDesktopNotify === false) {
				if (this.createDesktopNotify(opt) === true) {
					return this;
				}
			}
			
			/*- Setting up -*/
			var title   = opt.title   || this.title;
			var message = opt.message || opt.body || opt.content || opt.text || null;
			var onClick = opt.onClick || null;
			var onClose = opt.onClose || null;
			var timeout = (typeof opt.timeout !== 'undefined') ? opt.timeout : this.timeout;
			
			var isAlive = true;
			var closeTimer;
			
			/*- Positions -*/
			var hPosition   = this.hMargin;
			var vPosition   = this.vMargin;
			
			/*- Create a new element for notify -*/
			//
			// <div class="hypernotifier-notify">
			//   <div class="hypernotifier-title">Notification</div>
			//   <div class="hypernotifier-message">yadda yadda yadda..</div>
			//   <div class="hypernotifier-close">&#xd7;</div>
			// </div>
			//
			var notify = document.createElement('div');
			notify.className = this.className;
			var notifyTitle = document.createElement('div');
			notifyTitle.className = 'title';
			notifyTitle.innerText = title;
			notify.appendChild(notifyTitle);
			var notifyText = document.createElement('div');
			notifyText.className = 'text';
			notifyText.innerText = message;
			notify.appendChild(notifyText);
			var notifyClose = document.createElement('div');
			notifyClose.className = 'close';
			notifyClose.innerHTML = '&#xd7;';
			notify.appendChild(notifyClose);
			
			notifyClose.addEventListener('click', function(e) {
				
				e.stopPropagation();
				e.preventDefault();
				
				if (isAlive) {
					closeNotify();
				}
			}, false);
			
			notify.style.display = 'none';
			
			notify.style.position      = 'absolute';
			notify.style[this.hAlign] = hPosition + 'px';
			notify.style[this.vAlign] = vPosition + 'px';
			
			/*- onClick event -*/
			if (onClick === null) {
				notify.addEventListener('click', function(e) {
					
					closeNotify();
				});
			} else {
				notify.style.cursor = 'pointer';
				notify.addEventListener('click', function(e) {
					
					e.stopPropagation();
					e.preventDefault();
					
					onClick();
					closeNotify();
				});
			}
			
			/*- Insert to the target -*/
			this.target.appendChild(notify);
			
			/*- Show notify -*/
			notify.style.display = 'block';
			setTimeout(function() {
				notify.style.opacity = 1;
			}, 10);
			
			/*- Set timeout -*/
			if (timeout !== 0) {
				var onTimeout = function() {
					
					if (isAlive) {
						closeNotify();
					}
				}
				
				closeTimer = setTimeout(onTimeout, timeout * 1000);
				
				//Clear timeout
				notify.addEventListener('mouseover', function() {
					
					clearTimeout(closeTimer);
					closeTimer = setTimeout(onTimeout, timeout * 1000);
				});
			}
			
			/*- Remove a notify element -*/
			var closeNotify = function() {
				
				isAlive = false;
				
				notify.style.opacity = 0;
				
				//onClose event
				if (onClose !== null) {
					onClose();
				}
				
				setTimeout(function() {
					
					this.target.removeChild(notify);
					
					this.notifies.splice(this.notifies.indexOf(notify), 1);
					this.positioner();
				}.bind(this), 300);
			}.bind(this);
			
			this.notifies.push(notify);
			this.positioner();
			
			return this;
		}
		,
		createDesktopNotify: function _createDesktopNotify(opt) {
			/*- Setting up -*/
			var title   = opt.title   || this.title;
			var message = opt.message || opt.body || opt.content || opt.text || null;
			var onClick = opt.onClick || null;
			var onClose = opt.onClose || null;
			var timeout = (typeof opt.timeout !== 'undefined') ? opt.timeout : this.timeout;
			
			var isAlive = true;
			var notify  = null;
			var type    = this.desktopNotifyType;
			var closeTimer;
			
			/*- Create a desktop notification -*/
			if (type === 'webkit') {
				/*- Get Permissions -*/
				if (window.webkitNotifications.checkPermission() !== 0) {
					return false;
				}
				
				notify = window.webkitNotifications.createNotification('', title, message.stripTags());
			}
			
			/*- Set timeout -*/
			if (timeout !== 0) {
				closeTimer = setTimeout(function() {
					
					if (isAlive) {
						notify.cancel();
					}
				}, timeout * 1000);
			}
			
			/*- onClick event -*/
			if (onClick === null) {
				notify.addEventListener('click', function(e) {
					
					notify.cancel();
				});
			} else {
				notify.addEventListener('click', function(e) {
					
					onClick();
					notify.cancel();
				});
			}
			
			/*- onClose event -*/
			notify.onclose = function() {
				isAlive = false;
				if (onClose !== null) {
					onClose();
				}
			};
			
			/*- Show notify -*/
			notify.show();
			
			return true;
		}
		,
		positioner: function _positioner() {
			var tH = (this.target === document.body) ? (window.innerHeight || document.body.clientHeight) : this.target.offsetHeight;
			var pX = 0;
			var pY = 0;
			
			this.notifies.forEach(function(notify, i) {
				var x = this.vMargin + pX;
				var y = this.hMargin + pY;
				
				notify.style[this.hAlign] = x.toString(10) + 'px';
				notify.style[this.vAlign] = y.toString(10) + 'px';
				
				pY += this.spacing + notify.offsetHeight;
				
				if ((pY + notify.getHeight() + this.vMargin + this.spacing) >= tH) {
					pY  = 0;
					pX += this.spacing + notify.offsetWidth;
				}
			}.bind(this));
		}
	};
	
})();