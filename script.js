document.addEventListener('DOMContentLoaded', function () {
  console.log('Stránka načtena');
  // Inicializace: zaměření na input a skrytí/zobrazení obsahu
  document.getElementById('script').focus();
  document.getElementById('content').classList.add('hidden');
  document.getElementById('script-form').classList.remove('hidden');

  // Přidání posluchače pro klávesu Enter
  document.getElementById('script').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      console.log('Stisknuta klávesa Enter');
      checkScript();
    }
  });

  // Přidání posluchačů na tlačítka
  var buttons = document.querySelectorAll('.buttons-container button');
  console.log('Nalezeno tlačítek:', buttons.length);
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var buttonNumber = button.querySelector('.button-number').innerText;
      console.log('Kliknuto na tlačítko číslo:', buttonNumber);
      showContent(buttonNumber);
    });
  });

  // Skrytí veškerého obsahu při načtení
  document.querySelectorAll('.content').forEach(function (item) {
    item.classList.add('hidden');
  });
});

// Funkce pro zobrazení obsahu podle čísla tlačítka
    function showContent(buttonNumber) {
      console.log('Zobrazuji obsah pro:', buttonNumber);

      // Skrytí kontejneru s tlačítky
      document.getElementById('content').classList.add('hidden');

      // Skrytí všech obsahů
      document.querySelectorAll('.content').forEach(function (item) {
        item.classList.add('hidden');
        // Vyčištění předchozího obsahu
        while (item.firstChild) {
          item.removeChild(item.firstChild);
        }
      });

      // Zobrazení konkrétního obsahu
      var contentId = 'content-' + buttonNumber;
      var content = document.getElementById(contentId);
      if (content) {
        var pdfPath = `folder/${buttonNumber}.pdf`;
        console.log('Pokus o načtení PDF z:', pdfPath);

        // Kontrola, zda je zařízení mobilní
        var isMobile = window.innerWidth <= 600;

        if (isMobile) {
          // Pro mobilní zařízení použijeme upravený PDF renderer
          var viewerContainer = document.createElement('div');
          viewerContainer.id = 'pdf-viewer-container';
          viewerContainer.style.width = '100%';
          viewerContainer.style.height = '100%';
          viewerContainer.style.overflow = 'auto';
          viewerContainer.style.backgroundColor = '#333';
          content.appendChild(viewerContainer);

          // Načteme PDF pomocí PDF.js s vylepšenými parametry
          pdfjsLib.getDocument(pdfPath).promise.then(function(pdf) {
            console.log('PDF načteno, počet stránek:', pdf.numPages);

            // Funkce pro vykreslení stránky s vylepšenou kvalitou
            function renderPage(pageNumber) {
              pdf.getPage(pageNumber).then(function(page) {
                // Získáme originální velikost stránky
                var originalViewport = page.getViewport({ scale: 1 });

                // Spočítáme scale pro přizpůsobení šířce zařízení (s menšími okraji)
                var screenWidth = viewerContainer.clientWidth - 10; // odečteme menší okraje
                var scale = screenWidth / originalViewport.width;

                // Pro zajištění ostrosti textu zvýšíme rozlišení renderu
                var pixelRatio = window.devicePixelRatio || 1;
                var scaledViewport = page.getViewport({ scale: scale });

                // Vytvoříme canvas pro aktuální stránku
                var canvas = document.createElement('canvas');
                canvas.id = 'pdf-canvas-' + pageNumber;

                // Nastavíme canvas rozměry podle viewportu s pixel ratio pro ostrost
                canvas.width = Math.floor(scaledViewport.width * pixelRatio);
                canvas.height = Math.floor(scaledViewport.height * pixelRatio);
                canvas.style.width = Math.floor(scaledViewport.width) + "px";
                canvas.style.height = Math.floor(scaledViewport.height) + "px";

                // Přidáme canvas do containeru
                viewerContainer.appendChild(canvas);

                // Získáme kontext a nastavíme transformaci pro vysokou kvalitu
                var context = canvas.getContext('2d');
                context.scale(pixelRatio, pixelRatio);
                context.imageSmoothingEnabled = false; // vypneme vyhlazování pro ostřejší text

                // Vykreslíme stránku s vyšší kvalitou
                var renderContext = {
                  canvasContext: context,
                  viewport: scaledViewport,
                  enableWebGL: true,
                  renderInteractiveForms: true
                };

                page.render(renderContext).promise.then(function() {
                  console.log('Stránka', pageNumber, 'vykreslena ve vysoké kvalitě');

                  // Pokud existují další stránky, vykreslíme je pod sebe
                  if (pageNumber < pdf.numPages) {
                    renderPage(pageNumber + 1);
                  }
                });
              });
            }

            // Začneme vykreslovat od první stránky
            renderPage(1);
          }).catch(function(error) {
            console.error('Chyba při načítání PDF:', error);
            var errorMsg = document.createElement('div');
            errorMsg.innerText = 'Nepodařilo se načíst PDF. Zkontrolujte, zda soubor existuje.';
            errorMsg.style.color = 'white';
            errorMsg.style.padding = '20px';
            errorMsg.style.textAlign = 'center';
            viewerContainer.appendChild(errorMsg);
          });
        } else {
          // Pro desktop použijeme původní iframe
          var iframe = document.createElement('iframe');
          iframe.src = pdfPath;
          iframe.style.width = '100%';
          iframe.style.height = '100vh';
          iframe.style.border = 'none';

          content.appendChild(iframe);
        }

        // Přidání tlačítka "Zpět" dynamicky
        var backButton = document.createElement('button');
        backButton.id = 'back-button';
        backButton.innerHTML = '<span class="button-number"></span>Zpět';
        backButton.onclick = goBack;
        content.appendChild(backButton);
        console.log('Přidáno tlačítko Zpět');

        // Zobrazíme obsah
        content.classList.remove('hidden');
        console.log('Zobrazen div:', contentId);
      } else {
        console.error('Div nenalezen:', contentId);
      }
    }

// Funkce pro návrat na seznam tlačítek
function goBack() {
  console.log('Kliknuto na Zpět');
  // Skrytí všech obsahů
  document.querySelectorAll('.content').forEach(function (item) {
    item.classList.add('hidden');
    // Odstranění dynamicky přidaného obsahu
    while (item.firstChild) {
      item.removeChild(item.firstChild);
    }
  });

  // Zobrazení kontejneru s tlačítky
  document.getElementById('content').classList.remove('hidden');
  console.log('#content zobrazen');
}

// Funkce pro kontrolu hesla
var failedAttemptsKey = 'failedAttempts';
var blockDuration = 600000;
var storedPasswordHash = '605168aceb73437a516f06a3a72090658284a6ede290dfa73a9dbff9ef34c72b';

function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
}

function checkScript() {
  console.log('Kontroluji heslo');
  var scriptInput = document.getElementById('script');
  var enteredScript = scriptInput.value;
  var enteredScriptHash = hashPassword(enteredScript);
  var failedAttempts = JSON.parse(localStorage.getItem(failedAttemptsKey)) || {};
  var ipAddress = '';

  if (!failedAttempts[ipAddress]) {
    failedAttempts[ipAddress] = { count: 0, lastAttempt: Date.now() };
  }

  var currentTime = Date.now();
  var timeElapsed = currentTime - failedAttempts[ipAddress].lastAttempt;

  if (timeElapsed > blockDuration && failedAttempts[ipAddress].count >= 3) {
    failedAttempts[ipAddress] = { count: 0, lastAttempt: currentTime };
  }

  if (failedAttempts[ipAddress].count >= 3) {
    document.getElementById('incorrect-script').innerText = 'Příliš mnoho neúspěšných pokusů. Zkus to později.';
    document.getElementById('incorrect-script').classList.remove('hidden');
    scriptInput.disabled = true;
    document.getElementById('unlock-button').disabled = true;
    localStorage.setItem(failedAttemptsKey, JSON.stringify(failedAttempts));

    setTimeout(function () {
      scriptInput.disabled = false;
      failedAttempts[ipAddress] = { count: 0, lastAttempt: Date.now() };
      document.getElementById('incorrect-script').classList.add('hidden');
      document.getElementById('unlock-button').disabled = false;
      localStorage.setItem(failedAttemptsKey, JSON.stringify(failedAttempts));
    }, blockDuration);

    return;
  }

  if (enteredScriptHash === storedPasswordHash) {
    console.log('Heslo správné');
    document.getElementById('script-form').classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
    document.getElementById('incorrect-script').classList.add('hidden');
    failedAttempts[ipAddress] = { count: 0, lastAttempt: Date.now() };
    localStorage.setItem(failedAttemptsKey, JSON.stringify(failedAttempts));
  } else {
    if (failedAttempts[ipAddress].count === 2) {
      document.getElementById('incorrect-script').innerText = 'Neplatné heslo. Zadávání bylo zablokováno.';
      scriptInput.disabled = true;
      document.getElementById('unlock-button').disabled = true;
    } else {
      var remainingAttempts = 2 - failedAttempts[ipAddress].count;
      var attemptsText = remainingAttempts === 1 ? 'pokus' : 'pokusy';
      var text = remainingAttempts === 1 ? 'Zbývá 1 ' + attemptsText : 'Zbývají ' + remainingAttempts + ' ' + attemptsText;
      document.getElementById('incorrect-script').innerText = 'Neplatné heslo. ' + text + '.';
    }

    document.getElementById('incorrect-script').classList.remove('hidden');
    failedAttempts[ipAddress].count++;
    failedAttempts[ipAddress].lastAttempt = Date.now();
    scriptInput.value = '';
  }

  localStorage.setItem(failedAttemptsKey, JSON.stringify(failedAttempts));
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/epoprg/sw.js')
    .then(reg => console.log('Service Worker zaregistrován', reg))
    .catch(err => console.error('Chyba registrace:', err));
}