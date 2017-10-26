//META{"name":"Quicksave"}*//

class Quicksave {
	get local() {
		let lang = "";
		if (document.documentElement.getAttribute('lang')) lang = document.documentElement.getAttribute('lang').split('-')[0];
		switch (lang) {
			case "es": // Spanish
				return {
					startMessage: "${pluginName} ${version} ha empezado",
					description: 'Le permite guardar imágenes rápidamente con un nombre corto y aleatorio',
					quicksave: "Guardar imagen",
					finished: 'Finalizado',
					showFn: "Imagen guardada como ${filename}",
					saveFail: "Hubo un problema al guardar la imagen.",
					invalidLocation: "Ubicación no válida",
					save: "Guardar",
					reset: "Reajustar configuraciones",
					downloading: 'Bajando...',
					noFreeName: 'Error: Ha fallado al encontrar un nombre libre',
					alreadyExists: 'Error: Archivo ${filename} ya existe',
					alreadyExistsAndGenerateNew: 'Error: Archivo ${filename} ya existe. Generando un nuevo nombre para ello...',
					insertFilename: 'Insira el nombre del archivo',
					cancel: 'Cancelar',
					settings: {
						panel: 'Panel de configuraciones',
						labels: {
							directory: 'Directorio',
							original: 'Mantener el nombre original',
							filename: 'Mostrar el nombre del archivo al finalzar',
							randomLength: 'Tamaño del nombre al azar'
						},
						help: {
							original: 'Guardar archivos con el nombre original en lugar de un aleatorio',
							filename: 'Si mostrar el nombre del archivo al finalizar o no'
						},
						protip: {
							label: 'Consejo:',
							tip: 'Los archivos guardados ganan un nombre al azar en Base64. Sólo 4 caracteres permiten ~ 17 millones de nombres (64^4)'
						}
					}
				};
			case "pt": // Portuguese
				return {
					startMessage: "${pluginName} ${version} iniciado",
					description: 'Permite salvar imagens rapidamente com um nome curto e aleatório',
					quicksave: "Salvar imagem",
					finished: 'Finalizado',
					filename: "Imagem salva como ${filename}",
					saveFail: "Houve um problema ao salvar a imagem",
					invalidLocation: "Local inválido",
					save: "Salvar",
					reset: "Redefinir configurações",
					downloading: 'Baixando...',
					noFreeName: 'Erro: Falha ao encontrar um nome disponível',
					alreadyExists: 'Erro: Arquivo ${filename} já existe',
					alreadyExistsAndGenerateNew: 'Error: Arquivo ${filename} já existe. Gerando um novo nome para ele...',
					insertFilename: 'Insira o nome do arquivo',
					cancel: 'Cancelar',
					settings: {
						panel: 'Painel de configurações',
						labels: {
							directory: 'Diretório',
							original: 'Manter o nome original',
							filename: 'Mostrar nome do arquivo ao terminar de baixar',
							randomLength: 'Tamanho do nome aleatório'
						},
						help: {
							original: 'Salvar arquivos com o nome original em vez de um aleatório',
							filename: 'Mostrar o nome do arquivo ao finalizar ou não'
						},
						protip: {
							label: 'Fica a dica:',
							tip: 'Arquivos salvos ganham um nome aleatório em Base64. Só 4 caracteres permitem ~17 milhões de nomes (64^4)'
						}
					}
				};
			default: // English
				return {
					startMessage: "${pluginName} ${version} has started.",
					description: 'Lets you save images fast with a short random name',
					quicksave: "Quicksave",
					finished: 'Finished',
					filename: "Image saved as ${filename}",
					saveFail: "There was an issue saving the image.",
					invalidLocation: "Invalid location",
					save: "Save",
					reset: "Reset settings",
					downloading: 'Downloading...',
					noFreeName: 'Error: Failed to find a free file name',
					alreadyExists: 'Error: File ${filename} already exists',
					alreadyExistsAndGenerateNew: 'Error: File ${filename} already exists. Generating new name for it...',
					insertFilename: 'Insert file name',
					cancel: 'Cancel',
					settings: {
						panel: 'Settings panel',
						labels: {
							directory: 'Directory',
							original: 'Keep original name',
							filename: 'Show file name when finished downloading',
							randomLength: 'Random file name length'
						},
						help: {
							original: 'Save files with original file name instead of new random one',
							filename: 'Whether to show file name on ending or not'
						},
						protip: {
							label: 'Protip:',
							tip: 'Saved files get a random base64 name. Only 4 chars allow ~17 million different file names (64^4).'
						}
					}
				};
		}
	}
	getAuthor()      { return "Nirewen"             }
	getName()        { return "Quicksave"           }
	getDescription() { return this.local.description}
	getVersion()     { return "0.1.8"               }
	start() {
		let self = this;
		$('#zeresLibraryScript').remove();
		$('head').append($("<script type='text/javascript' id='zeresLibraryScript' src='https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js'>"));
		
		if (typeof window.ZeresLibrary !== "undefined") 
			this.initialize();
		else 
			$('#zeresLibraryScript').on("load", () => self.initialize());
	}
	initialize() {
		BdApi.injectCSS(this.getName(), this.css);
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/nirewen/Quicksave/master/Quicksave.plugin.js");
		PluginUtilities.showToast(PluginUtilities.formatString(this.local.startMessage, {pluginName: this.getName(), version: this.getVersion()}));
		this.initialized = true;
		this.loadSettings();
	}
	stop() {BdApi.clearCSS(this.getName())}
	load() {BdApi.injectCSS(`${this.getName()}-inputs`, this.inputCSS)}
	unload() {BdApi.clearCSS(`${this.getName()}-inputs`)}
	accessSync(dir) {
		let fs = require('fs');
		try {
			fs.accessSync(dir, fs.F_OK);
			return true;
		} catch (e) {
			return false;
		}
	}
	
	closeModal(modal) {
		modal.addClass('closing');
		setTimeout(() => modal.remove(), 100);
	}
	
	openModal(modal) {
		if (document.querySelector('.app-XZYfmp')) 
			$('.app-XZYfmp').siblings('[class*="theme-"]:not(.popouts)').first().append(modal);
		else 
			$('.app').siblings('[class*="theme-"]').first().append(modal);
		let self     = this,
			url      = $('.modal-image')[0].childNodes[1].attributes[0].nodeValue,
			filetype = '.' + url.split('.').slice(-1)[0].split('?')[0];
			
		modal.find('.hint').html(modal.find('.filename').val() + filetype);
		modal.find('.footer .button').click(e => self.closeModal(modal));
		modal.find('.footer .button-primary').click(e => self.saveCurrentImage(modal.find('.filename').val()));
		modal.find('.filename')
			.on("input", e => modal.find('.hint').html(modal.find('.filename').val() + filetype))
			.on("keyup", e => {
				let code = e.keyCode || e.which;
				if (code == 13) {
					e.preventDefault();
					self.saveCurrentImage(modal.find('.filename').val());
					self.closeModal(modal);
				}
			})
			.focus();
	}

	observer(e) {
		let fs   = require('fs'),
			self = this;
		if (e.addedNodes.length > 0 && (e.addedNodes[0].className == 'callout-backdrop' || e.addedNodes[0].className == 'backdrop-2ohBEd')) {
			let elem   = $('.modal-image a');
			if (!elem) return;
			
			fs.access(this.settings.directory, fs.W_OK, err => {
				let button = $('<a id="qs_button" class="download-button"></a>');
				if (err)
					button.html(this.local.invalidLocation);
				else {
					button.html(this.local.quicksave);
					button.click(e => {
						if (e.shiftKey)
							self.openModal($(PluginUtilities.formatString(self.modalHTML, {insertFilename: this.local.insertFilename, cancel: this.local.cancel, save: this.local.save})));
						else
							self.saveCurrentImage();
					});
				}	
				elem.after($('<span class="download-button"> | </span>'), button);
			});
		}
	}
	saveSettings() {
		PluginUtilities.saveSettings(this.getName(), this.settings);
	}

	loadSettings() {
		this.settings = PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
	}
	
	getSettingsPanel() {
		let panel = $("<form>").addClass("form").css("width", "100%");
		if (this.initialized) this.generateSettings(panel);
		return panel[0];
	}
	generateSettings(panel) {
		new PluginSettings.ControlGroup(this.local.settings.panel, () => this.saveSettings(), {shown: true}).appendTo(panel).append(
			new PluginSettings.SettingField(this.local.settings.labels.directory, '', {type: "text", placeholder: 'none', value: this.settings.directory, width:'400', class: 'quicksave input'}, text => {
				text.endsWith('/') 
					? this.settings.directory = text
					: this.settings.directory = text + '/';
			}), 
			new PluginSettings.Checkbox(this.local.settings.labels.original, this.local.settings.help.original, this.settings.norandom, checked => {
				this.settings.norandom = checked;
			}), 
			new PluginSettings.Checkbox(this.local.settings.labels.filename, this.local.settings.help.filename, this.settings.showfn, checked => {
				this.settings.showfn = checked;
			}), 
			new PluginSettings.SettingField(this.local.settings.labels.randomLength, '', {type: 'number', value: `${this.settings.fnLength}`, class: 'quicksave input', min: '1'}, number => {
				this.settings.fnLength = number;
			}),
			$(`<div class='protip inline'>
				<label class='label'>${this.local.settings.protip.label}</label>
				<div class='tip'>${this.local.settings.protip.tip}</div>
			</div>`),
			$(`<button type="button" class="buttonRedFilledDefault-1TrZ9q buttonFilledDefault-AELjWf buttonDefault-2OLW-v button-2t3of8 buttonFilled-29g7b5 buttonRedFilled-1NjJNj mediumGrow-uovsMu" style='margin: 10px 0; float: right;'>${this.local.reset}</button>`)
				.click(() => {
					this.settings = this.defaultSettings;
					this.saveSettings();
					panel.empty();
					this.generateSettings(panel);
				})
		);
	}

	randomFilename64(length) {
		let name = '';
		while(length--)
			name += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'[(Math.random() * 64 | 0)];
		return name;
	}

	saveCurrentImage(filename = '') {
		let button = $('#qs_button'),
			fs     = require('fs'),
			dir    = this.settings.directory,
			url    = $('.modal-image')[0].childNodes[1].attributes[0].nodeValue,
			net    = (url.split('//')[0] == 'https:') ? require('https') : require('http');
		
		if (/:large$/.test(url))
			url = url.replace(/:large$/, '');
		
		button.html(this.local.downloading);
		
		if (this.settings.norandom) {
			filename = url.split('/').slice(-1)[0].split('?')[0];

			if (this.accessSync(dir + filename))
				return PluginUtilities.showToast(PluginUtilities.formatString(this.local.alreadyExists, {filename}), {type: 'error'});
		} else {
			if (filename == '') 
				filename = this.randomFilename64(this.settings.fnLength);

			let filetype  = '.' + url.split('.').slice(-1)[0].split('?')[0],
				tries = 50;
			
			if (this.accessSync(dir + filename + filetype))
				PluginUtilities.showToast(PluginUtilities.formatString(this.local.alreadyExistsAndGenerateNew, {filename}), {type: 'warning'});
			
			while (this.accessSync(dir + filename + filetype) && tries--)
				filename = this.randomFilename64(this.settings.fnLength);
			
			if (tries == -1)
				return PluginUtilities.showToast(this.local.noFreeName, {type: 'error'});
			
			filename += filetype;
		}

		let dest = dir + filename,
			file = fs.createWriteStream(dest),
			self = this;
			
		net.get(url, res => {
			res.pipe(file);
			file.on('finish', () => {
				button.html(self.local.quicksave);
				PluginUtilities.showToast(self.local.finished, {type: 'success'});
				if (self.settings.showfn)
					PluginUtilities.showToast(PluginUtilities.formatString(self.local.filename, {filename}), {type: 'info'});
				file.close();
			});
		}).on('error', err => {
			fs.unlink(dest); 
			PluginUtilities.showToast(err.message, {type: 'error'});
			file.close();
		});
		
	}
	get defaultSettings() {
		return {
			directory: 'none',
			norandom: false,
			fnLength: 4,
			showfn: true
		}
	}
	get modalHTML() {
		return "<div id='quicksave-modal-wrapper'>" +
			"<div class='callout-backdrop backdrop-2ohBEd'></div>" +
			"<div class='modal-2LIEKY' style='opacity: 1; transform: scale(1) translateZ(0px);'>" +
				"<div class='modal-body inner-1_1f7b'>" +
					"<div class='comment'>" +
						"<div class='label'>" +
							"<span>${insertFilename}:</span>" +
						"</div>" +
						"<div class='inner'>" +
							"<input class='filename' maxlength='37'>" +
							"<div class='hint'></div>" +
						"</div>" +
					"</div>" +
					"<div class='footer'>" +
						"<button type='button' class='button'>" +
							"<span>${cancel}</span>" +
						"</button>" +
						"<button type='button' class='button button-primary'>" +
							"<span>${save}</span>" +
						"</button>" +
					"</div>" +
				"</div>" +
			"</div>" +
		"</div>";
	}
	get css() {
		return `
		@keyframes quicksave-modal-wrapper {
			to { transform: scale(1); opacity: 1; }
		}
		@keyframes quicksave-modal-wrapper-closing {
			to { transform: scale(0.7); opacity: 0; }
		}
		@keyframes quicksave-backdrop {
			to { opacity: 0.85; }
		}
		@keyframes quicksave-backdrop-closing {
			to { opacity: 0; }
		}
		#quicksave-modal-wrapper .callout-backdrop {
			animation: quicksave-backdrop 250ms ease;
			animation-fill-mode: forwards;
			opacity: 0;
			background-color: rgb(0, 0, 0);
			transform: translateZ(0px);
		}

		#quicksave-modal-wrapper.closing .callout-backdrop {
			animation: quicksave-backdrop-closing 200ms linear;
			animation-fill-mode: forwards;
			animation-delay: 50ms;
			opacity: 0.85;
		}

		#quicksave-modal-wrapper.closing .modal-body {
			animation: quicksave-modal-wrapper-closing 250ms cubic-bezier(0.19, 1, 0.22, 1);
			animation-fill-mode: forwards;
			opacity: 1;
			transform: scale(1);
		}
		#quicksave-modal-wrapper .label {
			font-size: 12px;
			font-weight: 500;
			text-transform: uppercase;
		}
		#quicksave-modal-wrapper .hint {
			background-color: transparent;
			color: #dadddf;
			left: 16px;
			line-height: 52px;
			position: absolute;
			top: 0;
		}
		#quicksave-modal-wrapper .comment {
			margin: 15px 18px 10px 18px;
		}
		#quicksave-modal-wrapper .filename {
			-webkit-box-flex: 1;
			background-color: transparent;
			border: none;
			color: #fff;
			flex: 1;
			line-height: 52px;
			margin-right: 16px;
			padding: 0;
			z-index: 1;
		}
		#quicksave-modal-wrapper .filename:focus {
			outline: none;
		}
		#quicksave-modal-wrapper .inner, 
		#quicksave-modal-wrapper .hint,
		#quicksave-modal-wrapper .filename {
			font-family: Whitney,Helvetica Neue,Helvetica,Arial,sans-serif;
			font-size: 14px;
			font-weight: 300;
			letter-spacing: .04em;
			white-space: pre;
		}
		#quicksave-modal-wrapper .inner {
			-webkit-box-align: center;
			-webkit-box-direction: normal;
			-webkit-box-orient: horizontal;
			align-items: center;
			border: 1px solid rgba(0,0,0,.2);
			background-color: rgba(36,39,43,.2);
			border-radius: 3px;
			display: flex;
			flex-direction: row;
			height: 52px;
			margin: 13px 0;
			padding: 0 16px;
			position: relative;
		}
		#quicksave-modal-wrapper .footer {
			-webkit-box-direction: normal;
			-webkit-box-orient: horizontal;
			-webkit-box-pack: end;
			background-color: #5b6dae;
			border-radius: 0 0 5px 5px;
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			padding: 10px;
		}
		#quicksave-modal-wrapper .footer .button {
			background-color: #5b6dae;
			height: 36px;
			min-width: 84px;
			padding: 0!important;
		}
		#quicksave-modal-wrapper .footer .button-primary {
			background-color: #fff;
			color: #5b6dae;
			transition: opacity .2s ease-in-out;
		}
		#quicksave-modal-wrapper .modal-body {
			animation: quicksave-modal-wrapper 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
			animation-fill-mode: forwards;
			transform: scale(0.7);
			transform-origin: 50% 50%;
			color: #fff;
			margin: 0;
			opacity: 0;
			-webkit-box-direction: normal;
			-webkit-box-orient: vertical;
			-webkit-filter: blur(0);
			-webkit-perspective: 1000;
			background-color: #7289da;
			border-radius: 5px;
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			filter: blur(0);
			flex-direction: column;
			width: 520px;
		}`;
	}
	get inputCSS() {
		return `
		.quicksave.input {
			-webkit-box-flex: 1;
			background-color: transparent;
			border: none;
			color: #fff;
			flex: 1;
			line-height: 52px;
			padding: 0;
			z-index: 1;
			-webkit-box-align: center;
			-webkit-box-direction: normal;
			-webkit-box-orient: horizontal;
			align-items: center;
			border: 1px solid rgba(0,0,0,.2);
			background-color: rgba(0,0,0,0.3);
			border-radius: 3px;
			display: flex;
			flex-direction: row;
			height: 40px;
			padding: 0 16px;
			position: relative;
		}`;
	}
}