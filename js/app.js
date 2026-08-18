/* =====================================================================
   Universal QR Tool — Application logic
   No backend. Everything runs client-side. Libraries are lazy-loaded
   only when the relevant feature (generate / scan) is first used.
   ===================================================================== */
(function(){
"use strict";

/* =====================================================================
   0. CONFIG — fill these in once you have real accounts / a real domain
   ===================================================================== */
var ADSENSE_CLIENT_ID = ""; // e.g. "ca-pub-XXXXXXXXXXXXXXXX" — leave empty to keep ads disabled
var GA_MEASUREMENT_ID = ""; // e.g. "G-XXXXXXXXXX" (Google Analytics 4) — leave empty to keep analytics disabled

/* =====================================================================
   1. I18N — translation strings + locale detection
   ===================================================================== */
var STRINGS = {
  en:{brandName:"Universal QR Tool",languageLabel:"Language",darkMode:"Dark mode",skipToContent:"Skip to content",
    tagline:"Create QR codes from text, links or numbers, and scan any QR code using your camera or an uploaded photo — free, fast and entirely in your browser.",
    generatorTitle:"Generate a QR Code",inputLabel:"Text, URL or number",inputHint:"Up to 1500 characters. Special characters are automatically escaped for safety.",
    generateBtn:"Generate QR Code",clearBtn:"Clear",previewPlaceholder:"Your QR code will appear here",
    downloadPng:"Download PNG",downloadSvg:"Download SVG",readerTitle:"Scan / Read a QR Code",
    startCamera:"Start Camera Scan",stopCamera:"Stop Camera",orUpload:"No camera? Upload an image containing a QR code instead:",
    uploadLabel:"Upload QR Image",decodedLabel:"Decoded content",copyBtn:"Copy to Clipboard",historyTitle:"History",
    historyEmpty:"No history yet.",clearHistory:"Clear History",footerText:"Universal QR Tool — all processing happens locally in your browser. No data is uploaded.",
    msgGenerated:"QR code created successfully.",msgEmptyInput:"Please enter some text or a URL first.",
    msgCameraDenied:"Camera access was denied or is unavailable. Try uploading an image instead.",
    msgScanSuccess:"QR code decoded successfully.",msgScanFail:"Invalid QR code — no data could be found in this image.",
    msgFileTooLarge:"File is too large. Please choose an image under 5MB.",msgCopied:"Copied to clipboard.",
    tagGenerated:"Generated",tagScanned:"Scanned",regenerate:"Re-generate",deleteEntry:"Delete",noCamera:"No camera detected on this device.",
    articleTitle:"How QR Codes Work",articleIntro:"A QR (Quick Response) code is a two-dimensional barcode that stores text, links or numbers in a pattern of black and white squares. Any phone camera or QR scanner can read it instantly, making it useful for sharing links, contact details, Wi-Fi credentials and more.",
    howToGenTitle:"How to create a QR code",howToGenText:"Type or paste your text, URL or number into the generator box above and click \"Generate QR Code\". A QR code image appears instantly — download it as a PNG for everyday use or as an SVG for print and large-format designs.",
    howToScanTitle:"How to scan a QR code",howToScanText:"Click \"Start Camera Scan\" and point your device's camera at a QR code — it will be decoded automatically. If your device has no camera or you prefer not to grant camera access, upload a photo containing a QR code instead and it will be decoded the same way.",
    faqTitle:"Frequently Asked Questions",
    faq1Q:"Is this QR code tool free to use?",faq1A:"Yes. Generating and scanning QR codes is completely free, with no sign-up required and no limit on everyday use.",
    faq2Q:"Is my data safe when I use this tool?",faq2A:"Yes. All QR generation and scanning happens locally in your browser — nothing you type, scan or upload is sent to a server.",
    faq3Q:"Why is my camera not working?",faq3A:"Your browser may be blocking camera access, or your device may not have a camera. Check your browser's site permissions, or use the image upload option instead.",
    faq4Q:"What is the difference between PNG and SVG downloads?",faq4A:"PNG is a fixed-resolution image ideal for screens and everyday sharing. SVG is a scalable vector format that stays sharp at any size, making it best for printing and large designs.",
    privacyPolicyTitle:"Privacy Policy",fileSelectedPrefix:"Selected: ",
    cookieConsentText:"We use cookies to serve ads and analyze traffic. By clicking Accept, you agree to this. See our Privacy Policy for details.",
    cookieAccept:"Accept",cookieDecline:"Decline",adLabel:"Advertisement",
    qrColorLabel:"QR Color",bgColorLabel:"Background Color",logoLabel:"Center Logo (optional)",
    chooseLogoBtn:"Choose Logo",removeLogoBtn:"Remove Logo",logoSelectedPrefix:"Logo: ",
    msgLowContrast:"These colors have low contrast and may be hard to scan. Consider a darker foreground or lighter background.",
    msgLogoInvalidType:"Please choose an image file for the logo.",
    msgLogoTooLarge:"Logo image is too large. Please choose an image under 2MB."},
  fr:{brandName:"Universal QR Tool",languageLabel:"Langue",darkMode:"Mode sombre",skipToContent:"Aller au contenu",
    tagline:"Créez des codes QR à partir de texte, de liens ou de nombres, et scannez n'importe quel code QR avec votre caméra ou une image téléchargée — gratuit, rapide et entièrement dans votre navigateur.",
    generatorTitle:"Générer un code QR",inputLabel:"Texte, URL ou nombre",inputHint:"Jusqu'à 1500 caractères. Les caractères spéciaux sont automatiquement échappés.",
    generateBtn:"Générer le code QR",clearBtn:"Effacer",previewPlaceholder:"Votre code QR apparaîtra ici",
    downloadPng:"Télécharger PNG",downloadSvg:"Télécharger SVG",readerTitle:"Scanner / Lire un code QR",
    startCamera:"Démarrer la caméra",stopCamera:"Arrêter la caméra",orUpload:"Pas de caméra ? Téléchargez une image contenant un code QR :",
    uploadLabel:"Téléverser une image QR",decodedLabel:"Contenu décodé",copyBtn:"Copier dans le presse-papiers",historyTitle:"Historique",
    historyEmpty:"Aucun historique pour le moment.",clearHistory:"Effacer l'historique",footerText:"Universal QR Tool — tout le traitement se fait localement dans votre navigateur. Aucune donnée n'est envoyée.",
    msgGenerated:"Code QR créé avec succès.",msgEmptyInput:"Veuillez d'abord saisir du texte ou une URL.",
    msgCameraDenied:"L'accès à la caméra a été refusé ou est indisponible. Essayez de téléverser une image.",
    msgScanSuccess:"Code QR décodé avec succès.",msgScanFail:"Code QR invalide — aucune donnée trouvée dans cette image.",
    msgFileTooLarge:"Fichier trop volumineux. Choisissez une image de moins de 5 Mo.",msgCopied:"Copié dans le presse-papiers.",
    tagGenerated:"Généré",tagScanned:"Scanné",regenerate:"Régénérer",deleteEntry:"Supprimer",noCamera:"Aucune caméra détectée sur cet appareil.",
    articleTitle:"Comment fonctionnent les codes QR",articleIntro:"Un code QR (réponse rapide) est un code-barres à deux dimensions qui stocke du texte, des liens ou des nombres sous forme de motif de carrés noirs et blancs. N'importe quel appareil photo ou scanner peut le lire instantanément, ce qui le rend utile pour partager des liens, des coordonnées, des identifiants Wi-Fi, etc.",
    howToGenTitle:"Comment créer un code QR",howToGenText:"Saisissez ou collez votre texte, URL ou nombre dans le champ du générateur ci-dessus et cliquez sur « Générer le code QR ». Une image apparaît instantanément — téléchargez-la en PNG pour un usage courant ou en SVG pour l'impression et les grands formats.",
    howToScanTitle:"Comment scanner un code QR",howToScanText:"Cliquez sur « Démarrer la caméra » et pointez la caméra de votre appareil vers un code QR — il sera décodé automatiquement. Si votre appareil n'a pas de caméra ou si vous préférez ne pas autoriser son accès, téléversez une photo contenant un code QR à la place.",
    faqTitle:"Questions fréquentes",
    faq1Q:"Cet outil de code QR est-il gratuit ?",faq1A:"Oui. Générer et scanner des codes QR est entièrement gratuit, sans inscription ni limite d'utilisation courante.",
    faq2Q:"Mes données sont-elles en sécurité ?",faq2A:"Oui. Toute la génération et le scan des codes QR se font localement dans votre navigateur — rien de ce que vous saisissez, scannez ou téléversez n'est envoyé à un serveur.",
    faq3Q:"Pourquoi ma caméra ne fonctionne-t-elle pas ?",faq3A:"Votre navigateur bloque peut-être l'accès à la caméra, ou votre appareil n'en possède pas. Vérifiez les autorisations de site de votre navigateur, ou utilisez l'option de téléversement d'image.",
    faq4Q:"Quelle est la différence entre PNG et SVG ?",faq4A:"Le PNG est une image à résolution fixe idéale pour les écrans et le partage courant. Le SVG est un format vectoriel évolutif qui reste net à toute taille, idéal pour l'impression et les grands formats.",
    privacyPolicyTitle:"Politique de confidentialité",fileSelectedPrefix:"Sélectionné : ",
    cookieConsentText:"Nous utilisons des cookies pour diffuser des publicités et analyser le trafic. En cliquant sur Accepter, vous y consentez. Consultez notre politique de confidentialité pour plus de détails.",
    cookieAccept:"Accepter",cookieDecline:"Refuser",adLabel:"Publicité",
    qrColorLabel:"Couleur du QR",bgColorLabel:"Couleur de fond",logoLabel:"Logo central (facultatif)",
    chooseLogoBtn:"Choisir un logo",removeLogoBtn:"Retirer le logo",logoSelectedPrefix:"Logo : ",
    msgLowContrast:"Ce contraste de couleurs est faible et pourrait être difficile à scanner. Utilisez un premier plan plus foncé ou un fond plus clair.",
    msgLogoInvalidType:"Veuillez choisir un fichier image pour le logo.",
    msgLogoTooLarge:"L'image du logo est trop volumineuse. Choisissez une image de moins de 2 Mo."},
  es:{brandName:"Universal QR Tool",languageLabel:"Idioma",darkMode:"Modo oscuro",skipToContent:"Saltar al contenido",
    tagline:"Crea códigos QR a partir de texto, enlaces o números, y escanea cualquier código QR con tu cámara o una imagen subida — gratis, rápido y todo en tu navegador.",
    generatorTitle:"Generar un código QR",inputLabel:"Texto, URL o número",inputHint:"Hasta 1500 caracteres. Los caracteres especiales se escapan automáticamente.",
    generateBtn:"Generar código QR",clearBtn:"Borrar",previewPlaceholder:"Tu código QR aparecerá aquí",
    downloadPng:"Descargar PNG",downloadSvg:"Descargar SVG",readerTitle:"Escanear / Leer un código QR",
    startCamera:"Iniciar cámara",stopCamera:"Detener cámara",orUpload:"¿Sin cámara? Sube una imagen con un código QR:",
    uploadLabel:"Subir imagen QR",decodedLabel:"Contenido decodificado",copyBtn:"Copiar al portapapeles",historyTitle:"Historial",
    historyEmpty:"Aún no hay historial.",clearHistory:"Borrar historial",footerText:"Universal QR Tool — todo el procesamiento ocurre localmente en tu navegador. No se sube ningún dato.",
    msgGenerated:"Código QR creado con éxito.",msgEmptyInput:"Por favor ingresa texto o una URL primero.",
    msgCameraDenied:"Se denegó el acceso a la cámara o no está disponible. Prueba subiendo una imagen.",
    msgScanSuccess:"Código QR decodificado con éxito.",msgScanFail:"Código QR inválido — no se encontraron datos en esta imagen.",
    msgFileTooLarge:"El archivo es demasiado grande. Elige una imagen de menos de 5MB.",msgCopied:"Copiado al portapapeles.",
    tagGenerated:"Generado",tagScanned:"Escaneado",regenerate:"Regenerar",deleteEntry:"Eliminar",noCamera:"No se detectó cámara en este dispositivo.",
    articleTitle:"Cómo funcionan los códigos QR",articleIntro:"Un código QR (respuesta rápida) es un código de barras bidimensional que almacena texto, enlaces o números en un patrón de cuadros blancos y negros. Cualquier cámara de teléfono o lector QR puede leerlo al instante, lo que resulta útil para compartir enlaces, datos de contacto, credenciales Wi-Fi y más.",
    howToGenTitle:"Cómo crear un código QR",howToGenText:"Escribe o pega tu texto, URL o número en el generador de arriba y haz clic en «Generar código QR». La imagen aparece al instante — descárgala en PNG para uso cotidiano o en SVG para impresión y grandes formatos.",
    howToScanTitle:"Cómo escanear un código QR",howToScanText:"Haz clic en «Iniciar cámara» y apunta la cámara de tu dispositivo a un código QR — se decodificará automáticamente. Si tu dispositivo no tiene cámara o prefieres no concederle acceso, sube una foto con un código QR y se decodificará igualmente.",
    faqTitle:"Preguntas frecuentes",
    faq1Q:"¿Esta herramienta de códigos QR es gratuita?",faq1A:"Sí. Generar y escanear códigos QR es completamente gratis, sin necesidad de registrarse ni límites de uso habitual.",
    faq2Q:"¿Mis datos están seguros al usar esta herramienta?",faq2A:"Sí. Toda la generación y el escaneo de códigos QR ocurre localmente en tu navegador — nada de lo que escribas, escanees o subas se envía a un servidor.",
    faq3Q:"¿Por qué no funciona mi cámara?",faq3A:"Tu navegador puede estar bloqueando el acceso a la cámara, o tu dispositivo puede no tener una. Revisa los permisos del sitio en tu navegador, o utiliza la opción de subir una imagen.",
    faq4Q:"¿Cuál es la diferencia entre PNG y SVG?",faq4A:"PNG es una imagen de resolución fija ideal para pantallas y uso cotidiano. SVG es un formato vectorial escalable que se mantiene nítido a cualquier tamaño, ideal para impresión y diseños grandes.",
    privacyPolicyTitle:"Política de privacidad",fileSelectedPrefix:"Seleccionado: ",
    cookieConsentText:"Utilizamos cookies para mostrar anuncios y analizar el tráfico. Al hacer clic en Aceptar, das tu consentimiento. Consulta nuestra Política de privacidad para más detalles.",
    cookieAccept:"Aceptar",cookieDecline:"Rechazar",adLabel:"Publicidad",
    qrColorLabel:"Color del QR",bgColorLabel:"Color de fondo",logoLabel:"Logo central (opcional)",
    chooseLogoBtn:"Elegir logo",removeLogoBtn:"Quitar logo",logoSelectedPrefix:"Logo: ",
    msgLowContrast:"Este contraste de colores es bajo y podría ser difícil de escanear. Prueba un primer plano más oscuro o un fondo más claro.",
    msgLogoInvalidType:"Por favor elige un archivo de imagen para el logo.",
    msgLogoTooLarge:"La imagen del logo es demasiado grande. Elige una imagen de menos de 2MB."},
  pt:{brandName:"Universal QR Tool",languageLabel:"Idioma",darkMode:"Modo escuro",skipToContent:"Ir para o conteúdo",
    tagline:"Crie códigos QR a partir de texto, links ou números, e leia qualquer código QR com a câmera ou uma imagem enviada — grátis, rápido e tudo no seu navegador.",
    generatorTitle:"Gerar um código QR",inputLabel:"Texto, URL ou número",inputHint:"Até 1500 caracteres. Caracteres especiais são escapados automaticamente.",
    generateBtn:"Gerar código QR",clearBtn:"Limpar",previewPlaceholder:"Seu código QR aparecerá aqui",
    downloadPng:"Baixar PNG",downloadSvg:"Baixar SVG",readerTitle:"Ler / Escanear um código QR",
    startCamera:"Iniciar câmera",stopCamera:"Parar câmera",orUpload:"Sem câmera? Envie uma imagem contendo um código QR:",
    uploadLabel:"Enviar imagem QR",decodedLabel:"Conteúdo decodificado",copyBtn:"Copiar para a área de transferência",historyTitle:"Histórico",
    historyEmpty:"Ainda não há histórico.",clearHistory:"Limpar histórico",footerText:"Universal QR Tool — todo o processamento acontece localmente no seu navegador. Nenhum dado é enviado.",
    msgGenerated:"Código QR criado com sucesso.",msgEmptyInput:"Insira um texto ou URL primeiro.",
    msgCameraDenied:"O acesso à câmera foi negado ou está indisponível. Tente enviar uma imagem.",
    msgScanSuccess:"Código QR decodificado com sucesso.",msgScanFail:"Código QR inválido — nenhum dado encontrado nesta imagem.",
    msgFileTooLarge:"Arquivo muito grande. Escolha uma imagem com menos de 5MB.",msgCopied:"Copiado para a área de transferência.",
    tagGenerated:"Gerado",tagScanned:"Escaneado",regenerate:"Regerar",deleteEntry:"Excluir",noCamera:"Nenhuma câmera detectada neste dispositivo.",
    articleTitle:"Como funcionam os códigos QR",articleIntro:"Um código QR (resposta rápida) é um código de barras bidimensional que armazena texto, links ou números em um padrão de quadrados pretos e brancos. Qualquer câmera de celular ou leitor QR pode lê-lo instantaneamente, sendo útil para compartilhar links, dados de contato, credenciais de Wi-Fi e mais.",
    howToGenTitle:"Como criar um código QR",howToGenText:"Digite ou cole seu texto, URL ou número no gerador acima e clique em \"Gerar código QR\". A imagem aparece instantaneamente — baixe em PNG para uso cotidiano ou em SVG para impressão e grandes formatos.",
    howToScanTitle:"Como escanear um código QR",howToScanText:"Clique em \"Iniciar câmera\" e aponte a câmera do seu dispositivo para um código QR — ele será decodificado automaticamente. Se seu dispositivo não tiver câmera ou preferir não conceder acesso, envie uma foto contendo um código QR em vez disso.",
    faqTitle:"Perguntas frequentes",
    faq1Q:"Esta ferramenta de código QR é gratuita?",faq1A:"Sim. Gerar e escanear códigos QR é totalmente gratuito, sem necessidade de cadastro nem limite de uso cotidiano.",
    faq2Q:"Meus dados estão seguros ao usar esta ferramenta?",faq2A:"Sim. Toda a geração e leitura de códigos QR acontece localmente no seu navegador — nada do que você digita, escaneia ou envia é enviado a um servidor.",
    faq3Q:"Por que minha câmera não está funcionando?",faq3A:"Seu navegador pode estar bloqueando o acesso à câmera, ou seu dispositivo pode não ter uma. Verifique as permissões do site no navegador, ou use a opção de enviar imagem.",
    faq4Q:"Qual a diferença entre downloads PNG e SVG?",faq4A:"PNG é uma imagem de resolução fixa, ideal para telas e uso cotidiano. SVG é um formato vetorial escalável que permanece nítido em qualquer tamanho, ideal para impressão e designs grandes.",
    privacyPolicyTitle:"Política de Privacidade",fileSelectedPrefix:"Selecionado: ",
    cookieConsentText:"Usamos cookies para exibir anúncios e analisar o tráfego. Ao clicar em Aceitar, você concorda com isso. Consulte nossa Política de Privacidade para mais detalhes.",
    cookieAccept:"Aceitar",cookieDecline:"Recusar",adLabel:"Publicidade",
    qrColorLabel:"Cor do QR",bgColorLabel:"Cor de fundo",logoLabel:"Logo central (opcional)",
    chooseLogoBtn:"Escolher logo",removeLogoBtn:"Remover logo",logoSelectedPrefix:"Logo: ",
    msgLowContrast:"Este contraste de cores é baixo e pode dificultar a leitura. Considere um primeiro plano mais escuro ou um fundo mais claro.",
    msgLogoInvalidType:"Escolha um arquivo de imagem para o logo.",
    msgLogoTooLarge:"A imagem do logo é muito grande. Escolha uma imagem com menos de 2MB."},
  ru:{brandName:"Universal QR Tool",languageLabel:"Язык",darkMode:"Тёмная тема",skipToContent:"Перейти к содержимому",
    tagline:"Создавайте QR-коды из текста, ссылок или чисел и сканируйте любые QR-коды с помощью камеры или загруженного изображения — бесплатно, быстро и прямо в браузере.",
    generatorTitle:"Создать QR-код",inputLabel:"Текст, URL или число",inputHint:"До 1500 символов. Специальные символы экранируются автоматически.",
    generateBtn:"Создать QR-код",clearBtn:"Очистить",previewPlaceholder:"Ваш QR-код появится здесь",
    downloadPng:"Скачать PNG",downloadSvg:"Скачать SVG",readerTitle:"Сканировать / Считать QR-код",
    startCamera:"Включить камеру",stopCamera:"Остановить камеру",orUpload:"Нет камеры? Загрузите изображение с QR-кодом:",
    uploadLabel:"Загрузить изображение QR",decodedLabel:"Расшифрованное содержимое",copyBtn:"Скопировать в буфер обмена",historyTitle:"История",
    historyEmpty:"Пока нет истории.",clearHistory:"Очистить историю",footerText:"Universal QR Tool — вся обработка происходит локально в вашем браузере. Данные никуда не отправляются.",
    msgGenerated:"QR-код успешно создан.",msgEmptyInput:"Сначала введите текст или URL.",
    msgCameraDenied:"Доступ к камере отклонён или недоступен. Попробуйте загрузить изображение.",
    msgScanSuccess:"QR-код успешно расшифрован.",msgScanFail:"Неверный QR-код — данные не найдены на этом изображении.",
    msgFileTooLarge:"Файл слишком большой. Выберите изображение до 5МБ.",msgCopied:"Скопировано в буфер обмена.",
    tagGenerated:"Создан",tagScanned:"Сканирован",regenerate:"Создать снова",deleteEntry:"Удалить",noCamera:"Камера на этом устройстве не обнаружена.",
    articleTitle:"Как работают QR-коды",articleIntro:"QR-код (код быстрого реагирования) — это двумерный штрихкод, который хранит текст, ссылки или числа в виде узора из чёрных и белых квадратов. Любая камера телефона или сканер QR может мгновенно его считать, что удобно для обмена ссылками, контактами, данными Wi-Fi и другим.",
    howToGenTitle:"Как создать QR-код",howToGenText:"Введите или вставьте текст, URL или число в поле генератора выше и нажмите «Создать QR-код». Изображение появится мгновенно — скачайте его в PNG для повседневного использования или в SVG для печати и крупных форматов.",
    howToScanTitle:"Как отсканировать QR-код",howToScanText:"Нажмите «Включить камеру» и наведите камеру устройства на QR-код — он будет расшифрован автоматически. Если на устройстве нет камеры или вы не хотите предоставлять к ней доступ, загрузите фото с QR-кодом — оно будет расшифровано так же.",
    faqTitle:"Часто задаваемые вопросы",
    faq1Q:"Этот инструмент для QR-кодов бесплатный?",faq1A:"Да. Создание и сканирование QR-кодов полностью бесплатно, без регистрации и ограничений при обычном использовании.",
    faq2Q:"Безопасны ли мои данные при использовании этого инструмента?",faq2A:"Да. Всё создание и сканирование QR-кодов происходит локально в вашем браузере — ничего из введённого, отсканированного или загруженного не отправляется на сервер.",
    faq3Q:"Почему не работает моя камера?",faq3A:"Возможно, браузер блокирует доступ к камере, либо на устройстве её нет. Проверьте разрешения сайта в браузере или используйте загрузку изображения.",
    faq4Q:"В чём разница между PNG и SVG?",faq4A:"PNG — изображение с фиксированным разрешением, идеально для экранов и повседневного использования. SVG — масштабируемый векторный формат, остающийся чётким при любом размере, лучше всего подходит для печати и крупных макетов.",
    privacyPolicyTitle:"Политика конфиденциальности",fileSelectedPrefix:"Выбрано: ",
    cookieConsentText:"Мы используем файлы cookie для показа рекламы и анализа трафика. Нажимая «Принять», вы соглашаетесь с этим. Подробнее см. в нашей Политике конфиденциальности.",
    cookieAccept:"Принять",cookieDecline:"Отклонить",adLabel:"Реклама",
    qrColorLabel:"Цвет QR-кода",bgColorLabel:"Цвет фона",logoLabel:"Логотип по центру (необязательно)",
    chooseLogoBtn:"Выбрать логотип",removeLogoBtn:"Удалить логотип",logoSelectedPrefix:"Логотип: ",
    msgLowContrast:"Низкий контраст этих цветов может затруднить сканирование. Используйте более тёмный передний план или более светлый фон.",
    msgLogoInvalidType:"Пожалуйста, выберите файл изображения для логотипа.",
    msgLogoTooLarge:"Изображение логотипа слишком большое. Выберите изображение до 2МБ."},
  ar:{brandName:"Universal QR Tool",languageLabel:"اللغة",darkMode:"الوضع الداكن",skipToContent:"تخطَّ إلى المحتوى",
    tagline:"أنشئ رموز QR من النص أو الروابط أو الأرقام، وامسح أي رمز QR باستخدام الكاميرا أو صورة مرفوعة — مجانًا وبسرعة داخل متصفحك بالكامل.",
    generatorTitle:"إنشاء رمز QR",inputLabel:"نص أو رابط أو رقم",inputHint:"حتى 1500 حرف. يتم الهروب من الأحرف الخاصة تلقائيًا للأمان.",
    generateBtn:"إنشاء رمز QR",clearBtn:"مسح",previewPlaceholder:"سيظهر رمز QR الخاص بك هنا",
    downloadPng:"تنزيل PNG",downloadSvg:"تنزيل SVG",readerTitle:"مسح / قراءة رمز QR",
    startCamera:"بدء المسح بالكاميرا",stopCamera:"إيقاف الكاميرا",orUpload:"لا توجد كاميرا؟ ارفع صورة تحتوي على رمز QR بدلاً من ذلك:",
    uploadLabel:"رفع صورة QR",decodedLabel:"المحتوى المفكوك التشفير",copyBtn:"نسخ إلى الحافظة",historyTitle:"السجل",
    historyEmpty:"لا يوجد سجل بعد.",clearHistory:"مسح السجل",footerText:"Universal QR Tool — تتم كل المعالجة محليًا في متصفحك. لا يتم رفع أي بيانات.",
    msgGenerated:"تم إنشاء رمز QR بنجاح.",msgEmptyInput:"يرجى إدخال نص أو رابط أولاً.",
    msgCameraDenied:"تم رفض الوصول إلى الكاميرا أو أنها غير متاحة. جرّب رفع صورة بدلاً من ذلك.",
    msgScanSuccess:"تم فك تشفير رمز QR بنجاح.",msgScanFail:"رمز QR غير صالح — لم يتم العثور على بيانات في هذه الصورة.",
    msgFileTooLarge:"الملف كبير جدًا. اختر صورة أصغر من 5 ميجابايت.",msgCopied:"تم النسخ إلى الحافظة.",
    tagGenerated:"تم الإنشاء",tagScanned:"تم المسح",regenerate:"إعادة الإنشاء",deleteEntry:"حذف",noCamera:"لم يتم العثور على كاميرا على هذا الجهاز.",
    articleTitle:"كيف تعمل رموز QR",articleIntro:"رمز QR (الاستجابة السريعة) هو رمز شريطي ثنائي الأبعاد يخزّن نصًا أو روابط أو أرقامًا في نمط من المربعات السوداء والبيضاء. يمكن لأي كاميرا هاتف أو قارئ QR قراءته فورًا، مما يجعله مفيدًا لمشاركة الروابط وبيانات الاتصال وبيانات شبكة Wi-Fi وغيرها.",
    howToGenTitle:"كيفية إنشاء رمز QR",howToGenText:"اكتب أو ألصق النص أو الرابط أو الرقم في مربع الإنشاء أعلاه وانقر على «إنشاء رمز QR». تظهر الصورة فورًا — نزّلها بصيغة PNG للاستخدام اليومي أو SVG للطباعة والتصاميم الكبيرة.",
    howToScanTitle:"كيفية مسح رمز QR",howToScanText:"انقر على «بدء المسح بالكاميرا» ووجّه كاميرا جهازك نحو رمز QR — سيتم فك تشفيره تلقائيًا. إذا لم يكن لديك كاميرا أو تفضّل عدم منح الوصول إليها، ارفع صورة تحتوي على رمز QR بدلاً من ذلك وسيتم فك تشفيرها بنفس الطريقة.",
    faqTitle:"الأسئلة الشائعة",
    faq1Q:"هل هذه الأداة مجانية؟",faq1A:"نعم. إنشاء ومسح رموز QR مجاني بالكامل، دون الحاجة إلى تسجيل ودون حدود للاستخدام العادي.",
    faq2Q:"هل بياناتي آمنة عند استخدام هذه الأداة؟",faq2A:"نعم. تتم كل عمليات إنشاء ومسح رموز QR محليًا داخل متصفحك — لا يُرسل أي شيء تكتبه أو تمسحه أو ترفعه إلى أي خادم.",
    faq3Q:"لماذا لا تعمل الكاميرا لدي؟",faq3A:"قد يكون متصفحك يحظر الوصول إلى الكاميرا، أو قد لا يحتوي جهازك على كاميرا. تحقق من أذونات الموقع في متصفحك، أو استخدم خيار رفع الصورة بدلاً من ذلك.",
    faq4Q:"ما الفرق بين تنزيل PNG وSVG؟",faq4A:"PNG صورة بدقة ثابتة ومثالية للشاشات والمشاركة اليومية. أما SVG فهو تنسيق متجهي قابل للتحجيم يبقى واضحًا بأي حجم، وهو الأفضل للطباعة والتصاميم الكبيرة.",
    privacyPolicyTitle:"سياسة الخصوصية",fileSelectedPrefix:"تم اختيار: ",
    cookieConsentText:"نستخدم ملفات تعريف الارتباط لعرض الإعلانات وتحليل حركة الزيارات. بالنقر على «قبول» فإنك توافق على ذلك. راجع سياسة الخصوصية لمزيد من التفاصيل.",
    cookieAccept:"قبول",cookieDecline:"رفض",adLabel:"إعلان",
    qrColorLabel:"لون رمز QR",bgColorLabel:"لون الخلفية",logoLabel:"شعار في المنتصف (اختياري)",
    chooseLogoBtn:"اختيار شعار",removeLogoBtn:"إزالة الشعار",logoSelectedPrefix:"الشعار: ",
    msgLowContrast:"تباين هذه الألوان منخفض وقد يصعب مسحه ضوئيًا. جرّب لونًا أماميًا أغمق أو خلفية أفتح.",
    msgLogoInvalidType:"يرجى اختيار ملف صورة للشعار.",
    msgLogoTooLarge:"صورة الشعار كبيرة جدًا. اختر صورة أصغر من 2 ميجابايت."},
  zh:{brandName:"通用二维码工具",languageLabel:"语言",darkMode:"深色模式",skipToContent:"跳到内容",
    tagline:"从文本、链接或数字生成二维码，并使用摄像头或上传的图片扫描任意二维码——免费、快速，完全在浏览器中运行。",
    generatorTitle:"生成二维码",inputLabel:"文本、链接或数字",inputHint:"最多1500个字符。特殊字符会自动转义以确保安全。",
    generateBtn:"生成二维码",clearBtn:"清除",previewPlaceholder:"您的二维码将显示在此处",
    downloadPng:"下载 PNG",downloadSvg:"下载 SVG",readerTitle:"扫描 / 读取二维码",
    startCamera:"启动摄像头扫描",stopCamera:"停止摄像头",orUpload:"没有摄像头？改为上传包含二维码的图片：",
    uploadLabel:"上传二维码图片",decodedLabel:"解码内容",copyBtn:"复制到剪贴板",historyTitle:"历史记录",
    historyEmpty:"暂无历史记录。",clearHistory:"清除历史记录",footerText:"通用二维码工具 — 所有处理均在您的浏览器本地完成，不会上传任何数据。",
    msgGenerated:"二维码创建成功。",msgEmptyInput:"请先输入文本或链接。",
    msgCameraDenied:"摄像头访问被拒绝或不可用，请尝试上传图片。",
    msgScanSuccess:"二维码解码成功。",msgScanFail:"无效的二维码 — 在此图片中未找到数据。",
    msgFileTooLarge:"文件过大，请选择小于5MB的图片。",msgCopied:"已复制到剪贴板。",
    tagGenerated:"已生成",tagScanned:"已扫描",regenerate:"重新生成",deleteEntry:"删除",noCamera:"未检测到此设备上的摄像头。",
    articleTitle:"二维码是如何工作的",articleIntro:"二维码（快速响应码）是一种二维条码，以黑白方块图案存储文本、链接或数字。任何手机摄像头或二维码扫描器都能立即读取，非常适合分享链接、联系方式、Wi-Fi密码等信息。",
    howToGenTitle:"如何创建二维码",howToGenText:"在上方生成器框中输入或粘贴文本、链接或数字，然后点击\"生成二维码\"。图像会立即显示——下载为PNG用于日常使用，或下载为SVG用于印刷和大幅面设计。",
    howToScanTitle:"如何扫描二维码",howToScanText:"点击\"启动摄像头扫描\"，将设备摄像头对准二维码，即可自动解码。如果您的设备没有摄像头，或不想授予摄像头权限，可改为上传包含二维码的照片，同样可以完成解码。",
    faqTitle:"常见问题",
    faq1Q:"这个二维码工具是免费的吗？",faq1A:"是的。生成和扫描二维码完全免费，无需注册，日常使用也没有次数限制。",
    faq2Q:"使用此工具时我的数据安全吗？",faq2A:"是的。所有二维码的生成和扫描都在您的浏览器本地完成——您输入、扫描或上传的任何内容都不会发送到服务器。",
    faq3Q:"为什么我的摄像头无法使用？",faq3A:"您的浏览器可能阻止了摄像头访问，或者您的设备没有摄像头。请检查浏览器的网站权限设置，或改用图片上传选项。",
    faq4Q:"下载PNG和SVG有什么区别？",faq4A:"PNG是分辨率固定的图像，适合屏幕显示和日常分享。SVG是可缩放的矢量格式，任何尺寸下都保持清晰，最适合印刷和大幅面设计。",
    privacyPolicyTitle:"隐私政策",fileSelectedPrefix:"已选择：",
    cookieConsentText:"我们使用 Cookie 来展示广告并分析流量。点击\"接受\"即表示您同意。详情请参阅我们的隐私政策。",
    cookieAccept:"接受",cookieDecline:"拒绝",adLabel:"广告",
    qrColorLabel:"二维码颜色",bgColorLabel:"背景颜色",logoLabel:"中心图标（可选）",
    chooseLogoBtn:"选择图标",removeLogoBtn:"移除图标",logoSelectedPrefix:"图标：",
    msgLowContrast:"这些颜色对比度较低，可能难以扫描。建议使用更深的前景色或更浅的背景色。",
    msgLogoInvalidType:"请为图标选择一个图片文件。",
    msgLogoTooLarge:"图标图片过大，请选择小于2MB的图片。"},
  th:{brandName:"Universal QR Tool",languageLabel:"ภาษา",darkMode:"โหมดมืด",skipToContent:"ข้ามไปยังเนื้อหา",
    tagline:"สร้างคิวอาร์โค้ดจากข้อความ ลิงก์ หรือตัวเลข และสแกนคิวอาร์โค้ดด้วยกล้องหรือรูปภาพที่อัปโหลด — ฟรี รวดเร็ว และทำงานในเบราว์เซอร์ของคุณทั้งหมด",
    generatorTitle:"สร้างคิวอาร์โค้ด",inputLabel:"ข้อความ ลิงก์ หรือตัวเลข",inputHint:"ไม่เกิน 1500 ตัวอักษร อักขระพิเศษจะถูกป้องกันโดยอัตโนมัติเพื่อความปลอดภัย",
    generateBtn:"สร้างคิวอาร์โค้ด",clearBtn:"ล้างข้อมูล",previewPlaceholder:"คิวอาร์โค้ดของคุณจะปรากฏที่นี่",
    downloadPng:"ดาวน์โหลด PNG",downloadSvg:"ดาวน์โหลด SVG",readerTitle:"สแกน / อ่านคิวอาร์โค้ด",
    startCamera:"เริ่มสแกนด้วยกล้อง",stopCamera:"หยุดกล้อง",orUpload:"ไม่มีกล้อง? อัปโหลดรูปภาพที่มีคิวอาร์โค้ดแทน:",
    uploadLabel:"อัปโหลดรูปคิวอาร์โค้ด",decodedLabel:"เนื้อหาที่ถอดรหัสแล้ว",copyBtn:"คัดลอกไปยังคลิปบอร์ด",historyTitle:"ประวัติ",
    historyEmpty:"ยังไม่มีประวัติ",clearHistory:"ล้างประวัติ",footerText:"Universal QR Tool — การประมวลผลทั้งหมดทำในเบราว์เซอร์ของคุณ ไม่มีการอัปโหลดข้อมูลใด ๆ",
    msgGenerated:"สร้างคิวอาร์โค้ดสำเร็จแล้ว",msgEmptyInput:"กรุณากรอกข้อความหรือลิงก์ก่อน",
    msgCameraDenied:"การเข้าถึงกล้องถูกปฏิเสธหรือไม่พร้อมใช้งาน ลองอัปโหลดรูปภาพแทน",
    msgScanSuccess:"ถอดรหัสคิวอาร์โค้ดสำเร็จแล้ว",msgScanFail:"คิวอาร์โค้ดไม่ถูกต้อง — ไม่พบข้อมูลในรูปภาพนี้",
    msgFileTooLarge:"ไฟล์มีขนาดใหญ่เกินไป กรุณาเลือกรูปภาพที่มีขนาดต่ำกว่า 5MB",msgCopied:"คัดลอกไปยังคลิปบอร์ดแล้ว",
    tagGenerated:"สร้างแล้ว",tagScanned:"สแกนแล้ว",regenerate:"สร้างใหม่",deleteEntry:"ลบ",noCamera:"ไม่พบกล้องบนอุปกรณ์นี้",
    articleTitle:"คิวอาร์โค้ดทำงานอย่างไร",articleIntro:"คิวอาร์โค้ด (Quick Response) คือบาร์โค้ดสองมิติที่เก็บข้อความ ลิงก์ หรือตัวเลขไว้ในรูปแบบตารางสี่เหลี่ยมสีดำและขาว กล้องมือถือหรือเครื่องสแกนคิวอาร์โค้ดใดก็สามารถอ่านได้ทันที เหมาะสำหรับแชร์ลิงก์ ข้อมูลติดต่อ รหัส Wi-Fi และอื่น ๆ",
    howToGenTitle:"วิธีสร้างคิวอาร์โค้ด",howToGenText:"พิมพ์หรือวางข้อความ ลิงก์ หรือตัวเลขลงในช่องสร้างด้านบน แล้วกด \"สร้างคิวอาร์โค้ด\" รูปภาพจะปรากฏขึ้นทันที — ดาวน์โหลดเป็น PNG สำหรับใช้งานทั่วไป หรือ SVG สำหรับงานพิมพ์และงานออกแบบขนาดใหญ่",
    howToScanTitle:"วิธีสแกนคิวอาร์โค้ด",howToScanText:"กด \"เริ่มสแกนด้วยกล้อง\" แล้วเล็งกล้องอุปกรณ์ของคุณไปที่คิวอาร์โค้ด ระบบจะถอดรหัสให้อัตโนมัติ หากอุปกรณ์ของคุณไม่มีกล้อง หรือไม่ต้องการอนุญาตให้ใช้กล้อง ให้อัปโหลดรูปภาพที่มีคิวอาร์โค้ดแทน ระบบจะถอดรหัสให้เช่นเดียวกัน",
    faqTitle:"คำถามที่พบบ่อย",
    faq1Q:"เครื่องมือคิวอาร์โค้ดนี้ฟรีหรือไม่?",faq1A:"ใช่ การสร้างและสแกนคิวอาร์โค้ดฟรีทั้งหมด ไม่ต้องสมัครสมาชิก และไม่จำกัดการใช้งานทั่วไป",
    faq2Q:"ข้อมูลของฉันปลอดภัยหรือไม่เมื่อใช้เครื่องมือนี้?",faq2A:"ใช่ การสร้างและสแกนคิวอาร์โค้ดทั้งหมดทำงานในเบราว์เซอร์ของคุณเท่านั้น — สิ่งที่คุณพิมพ์ สแกน หรืออัปโหลดจะไม่ถูกส่งไปยังเซิร์ฟเวอร์ใด ๆ",
    faq3Q:"ทำไมกล้องของฉันถึงใช้งานไม่ได้?",faq3A:"เบราว์เซอร์ของคุณอาจบล็อกการเข้าถึงกล้อง หรืออุปกรณ์ของคุณอาจไม่มีกล้อง ลองตรวจสอบการอนุญาตเว็บไซต์ในเบราว์เซอร์ หรือใช้ตัวเลือกอัปโหลดรูปภาพแทน",
    faq4Q:"PNG กับ SVG ต่างกันอย่างไร?",faq4A:"PNG คือรูปภาพความละเอียดคงที่ เหมาะสำหรับหน้าจอและการแชร์ทั่วไป ส่วน SVG คือไฟล์เวกเตอร์ที่ปรับขนาดได้โดยยังคมชัดในทุกขนาด เหมาะกับงานพิมพ์และงานออกแบบขนาดใหญ่",
    privacyPolicyTitle:"นโยบายความเป็นส่วนตัว",fileSelectedPrefix:"เลือกแล้ว: ",
    cookieConsentText:"เราใช้คุกกี้เพื่อแสดงโฆษณาและวิเคราะห์การเข้าชม การกดยอมรับถือว่าคุณยินยอม ดูรายละเอียดเพิ่มเติมได้ที่นโยบายความเป็นส่วนตัว",
    cookieAccept:"ยอมรับ",cookieDecline:"ปฏิเสธ",adLabel:"โฆษณา",
    qrColorLabel:"สีคิวอาร์โค้ด",bgColorLabel:"สีพื้นหลัง",logoLabel:"โลโก้ตรงกลาง (ไม่บังคับ)",
    chooseLogoBtn:"เลือกโลโก้",removeLogoBtn:"ลบโลโก้",logoSelectedPrefix:"โลโก้: ",
    msgLowContrast:"สีที่เลือกคอนทราสต์ต่ำ อาจสแกนยาก ลองใช้สีตัวโค้ดที่เข้มขึ้นหรือพื้นหลังที่อ่อนลง",
    msgLogoInvalidType:"กรุณาเลือกไฟล์รูปภาพสำหรับโลโก้",
    msgLogoTooLarge:"ไฟล์โลโก้มีขนาดใหญ่เกินไป กรุณาเลือกรูปภาพที่มีขนาดต่ำกว่า 2MB"}
};
var RTL_LANGS = ["ar"];
var SUPPORTED = Object.keys(STRINGS);
var currentLang = "en";

function detectLocale(){
  var stored = localStorage.getItem("uqrt_lang");
  if(stored && SUPPORTED.indexOf(stored) !== -1) return stored;
  var nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
  var short = nav.split("-")[0];
  if(short === "zh") return "zh";
  if(SUPPORTED.indexOf(short) !== -1) return short;
  return "en";
}

function t(key){
  return (STRINGS[currentLang] && STRINGS[currentLang][key]) || STRINGS.en[key] || key;
}

function applyLanguage(lang){
  if(SUPPORTED.indexOf(lang) === -1) lang = "en";
  currentLang = lang;
  localStorage.setItem("uqrt_lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGS.indexOf(lang) !== -1 ? "rtl" : "ltr";
  document.getElementById("langSelect").value = lang;

  document.querySelectorAll("[data-i18n]").forEach(function(el){
    var key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  renderHistory(); // re-render tags/buttons in new language
}

/* =====================================================================
   2. THEME (dark mode)
   ===================================================================== */
function applyTheme(mode){
  document.documentElement.setAttribute("data-theme", mode);
  document.getElementById("darkModeToggle").setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
  localStorage.setItem("uqrt_theme", mode);
}
function initTheme(){
  var stored = localStorage.getItem("uqrt_theme");
  if(stored){ applyTheme(stored); return; }
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

/* =====================================================================
   3. HELPERS
   ===================================================================== */
function showStatus(el, message, type){
  el.textContent = message;
  el.className = "status-msg " + type;
  el.style.display = "block";
}

// Only http(s) links are made clickable — deliberately excludes javascript:, data:, etc.
// so a malicious QR code can never turn into an executable link.
function isSafeHttpUrl(text){
  try{
    var u = new URL(text);
    return u.protocol === "http:" || u.protocol === "https:";
  }catch(e){
    return false;
  }
}

// Renders text into a container as a clickable link when it's a safe http(s) URL,
// otherwise as plain text. Uses DOM APIs only (never innerHTML) so no markup in the
// scanned/typed text can ever be interpreted as HTML.
function renderLinkableText(container, text){
  container.textContent = "";
  if(isSafeHttpUrl(text)){
    var a = document.createElement("a");
    a.href = text;
    a.textContent = text;
    a.target = "_blank";
    a.rel = "noopener noreferrer nofollow ugc";
    container.appendChild(a);
  } else {
    container.textContent = text;
  }
}

/* =====================================================================
   4. LAZY-LOADED SCRIPT HELPER
   ===================================================================== */
var loadedScripts = {};
function loadScript(src){
  if(loadedScripts[src]) return loadedScripts[src];
  loadedScripts[src] = new Promise(function(resolve, reject){
    var s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = function(){ delete loadedScripts[src]; reject(new Error("Failed to load " + src)); };
    document.head.appendChild(s);
  });
  return loadedScripts[src];
}
// qrcode-generator (kazuhikoarase) — zero dependencies, genuine synchronous PNG (data URL) + SVG output.
var QRGEN_SRC = "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js";
// jsQR — camera/image QR decoding.
var JSQR_SRC = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";

/* =====================================================================
   5. QR GENERATION
   Rendering is done by hand from the raw module matrix (instead of the
   library's built-in createDataURL/createSvgTag) so we can composite
   custom colors and an optional center logo. Error-correction level is
   always "H" (~30% recoverable) specifically so a center logo doesn't
   break scannability.
   ===================================================================== */
var qrPreview = document.getElementById("qrPreview");
var qrInput = document.getElementById("qrInput");
var generateStatus = document.getElementById("generateStatus");
var downloadPngBtn = document.getElementById("downloadPngBtn");
var downloadSvgBtn = document.getElementById("downloadSvgBtn");
var fgColorInput = document.getElementById("qrFgColor");
var bgColorInput = document.getElementById("qrBgColor");
var chooseLogoBtn = document.getElementById("chooseLogoBtn");
var removeLogoBtn = document.getElementById("removeLogoBtn");
var qrLogoInput = document.getElementById("qrLogoInput");
var logoNameDisplay = document.getElementById("logoNameDisplay");

var lastGeneratedText = "";
var lastPngDataUrl = "";
var lastSvgBuilder = null;
var currentLogoImg = null;      // in-memory HTMLImageElement, not persisted to localStorage
var currentLogoDataUrl = null;  // data: URL for the same logo, used for SVG embedding
var LOGO_SAFE_FRACTION = 0.22;  // logo covers ~22% of the QR width — safe at error-correction level H
var HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

function getQrMatrix(text){
  // eslint-disable-next-line no-undef
  var qr = qrcode(0, "H"); // typeNumber 0 = auto-size to fit the data
  qr.addData(text);
  qr.make();
  var n = qr.getModuleCount();
  var matrix = [];
  for(var r=0;r<n;r++){
    var row = [];
    for(var c=0;c<n;c++){ row.push(qr.isDark(r,c)); }
    matrix.push(row);
  }
  return {n:n, matrix:matrix};
}

function safeHexColor(value, fallback){
  return HEX_COLOR_RE.test(value) ? value : fallback;
}

// WCAG relative-luminance based contrast ratio, used only as a heuristic
// "might be hard to scan" warning — not a hard block.
function hexToRgb(hex){
  var m = /^#([0-9a-f]{6})$/i.exec(hex);
  if(!m) return null;
  var num = parseInt(m[1], 16);
  return {r:(num>>16)&255, g:(num>>8)&255, b:num&255};
}
function relLuminance(rgb){
  function chan(v){ v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }
  return 0.2126*chan(rgb.r) + 0.7152*chan(rgb.g) + 0.0722*chan(rgb.b);
}
function contrastRatio(hex1, hex2){
  var c1 = hexToRgb(hex1), c2 = hexToRgb(hex2);
  if(!c1 || !c2) return 21;
  var l1 = relLuminance(c1), l2 = relLuminance(c2);
  var lighter = Math.max(l1,l2), darker = Math.min(l1,l2);
  return (lighter+0.05) / (darker+0.05);
}

function renderQrToCanvas(matrixInfo, fgColor, bgColor, logoImg){
  var n = matrixInfo.n, matrix = matrixInfo.matrix;
  var quiet = 2, cell = 8;
  var total = n + quiet*2;
  var size = total*cell;
  var canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = fgColor;
  for(var r=0;r<n;r++){
    for(var c=0;c<n;c++){
      if(matrix[r][c]) ctx.fillRect((c+quiet)*cell, (r+quiet)*cell, cell, cell);
    }
  }
  if(logoImg){
    var box = size*LOGO_SAFE_FRACTION;
    var pad = box*0.12;
    var bx = (size-box)/2, by = (size-box)/2;
    ctx.fillStyle = bgColor;
    ctx.fillRect(bx-pad, by-pad, box+pad*2, box+pad*2);
    var scale = Math.min(box/logoImg.width, box/logoImg.height);
    var dw = logoImg.width*scale, dh = logoImg.height*scale;
    ctx.drawImage(logoImg, bx+(box-dw)/2, by+(box-dh)/2, dw, dh);
  }
  return canvas;
}

function escapeXmlAttr(str){
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function buildQrSvg(matrixInfo, fgColor, bgColor, logoDataUrl, altText){
  var n = matrixInfo.n, matrix = matrixInfo.matrix;
  var quiet = 2;
  var total = n + quiet*2;
  var parts = [];
  parts.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+total+' '+total+'" role="img" aria-label="'+escapeXmlAttr(altText)+'">');
  parts.push('<rect width="'+total+'" height="'+total+'" fill="'+bgColor+'"/>');
  for(var r=0;r<n;r++){
    for(var c=0;c<n;c++){
      if(matrix[r][c]) parts.push('<rect x="'+(c+quiet)+'" y="'+(r+quiet)+'" width="1" height="1" fill="'+fgColor+'"/>');
    }
  }
  if(logoDataUrl && logoDataUrl.indexOf("data:image/") === 0){
    var box = total*LOGO_SAFE_FRACTION;
    var pad = box*0.12;
    var x = (total-box)/2, y = (total-box)/2;
    parts.push('<rect x="'+(x-pad)+'" y="'+(y-pad)+'" width="'+(box+pad*2)+'" height="'+(box+pad*2)+'" fill="'+bgColor+'"/>');
    parts.push('<image href="'+escapeXmlAttr(logoDataUrl)+'" x="'+x+'" y="'+y+'" width="'+box+'" height="'+box+'" preserveAspectRatio="xMidYMid meet"/>');
  }
  parts.push('</svg>');
  return parts.join("");
}

function generateQR(text, skipHistory){
  if(!text || !text.trim()){
    showStatus(generateStatus, t("msgEmptyInput"), "error");
    return;
  }
  var safeText = text.slice(0, 1500);
  loadScript(QRGEN_SRC).then(function(){
    try{
      var matrixInfo = getQrMatrix(safeText);
      var fg = safeHexColor(fgColorInput.value, "#000000");
      var bg = safeHexColor(bgColorInput.value, "#ffffff");

      var canvas = renderQrToCanvas(matrixInfo, fg, bg, currentLogoImg);
      lastPngDataUrl = canvas.toDataURL("image/png");
      lastSvgBuilder = function(){ return buildQrSvg(matrixInfo, fg, bg, currentLogoDataUrl, safeText); };

      qrPreview.innerHTML = "";
      var img = document.createElement("img");
      img.src = lastPngDataUrl;
      img.alt = safeText;
      img.width = 220;
      img.height = 220;
      qrPreview.appendChild(img);

      lastGeneratedText = safeText;
      downloadPngBtn.disabled = false;
      downloadSvgBtn.disabled = false;

      if(contrastRatio(fg, bg) < 2.5){
        showStatus(generateStatus, t("msgLowContrast"), "error");
      } else {
        showStatus(generateStatus, t("msgGenerated"), "success");
      }
      if(!skipHistory) addHistoryEntry("generated", safeText);
    }catch(err){
      console.error(err);
      showStatus(generateStatus, "Could not render QR code.", "error");
    }
  }).catch(function(err){
    console.error(err);
    showStatus(generateStatus, "Could not load QR library. Check your connection.", "error");
  });
}

downloadPngBtn.addEventListener("click", function(){
  if(!lastPngDataUrl) return;
  var link = document.createElement("a");
  link.download = "qr-code.png";
  link.href = lastPngDataUrl;
  link.click();
});

downloadSvgBtn.addEventListener("click", function(){
  if(!lastGeneratedText || !lastSvgBuilder) return;
  try{
    var svgStr = lastSvgBuilder();
    var blob = new Blob([svgStr], {type: "image/svg+xml"});
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.download = "qr-code.svg";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }catch(err){
    console.error(err);
    showStatus(generateStatus, "Could not build SVG.", "error");
  }
});

document.getElementById("generateBtn").addEventListener("click", function(){
  generateQR(qrInput.value);
});
qrInput.addEventListener("keydown", function(e){
  if(e.key === "Enter" && (e.ctrlKey || e.metaKey)){ generateQR(qrInput.value); }
});

// Live re-render on color/logo change, but only if a QR already exists — never touches history.
var colorChangeTimer = null;
function scheduleLiveRerender(){
  if(!lastGeneratedText) return;
  clearTimeout(colorChangeTimer);
  colorChangeTimer = setTimeout(function(){ generateQR(lastGeneratedText, true); }, 60);
}
fgColorInput.addEventListener("input", scheduleLiveRerender);
bgColorInput.addEventListener("input", scheduleLiveRerender);

chooseLogoBtn.addEventListener("click", function(){ qrLogoInput.click(); });
var MAX_LOGO_BYTES = 2*1024*1024; // 2MB limit
qrLogoInput.addEventListener("change", function(e){
  var file = e.target.files && e.target.files[0];
  e.target.value = ""; // allow re-selecting the same file later
  if(!file) return;
  if(!file.type || file.type.indexOf("image/") !== 0){
    showStatus(generateStatus, t("msgLogoInvalidType"), "error");
    return;
  }
  if(file.size > MAX_LOGO_BYTES){
    showStatus(generateStatus, t("msgLogoTooLarge"), "error");
    return;
  }
  var reader = new FileReader();
  reader.onload = function(evt){
    var img = new Image();
    img.onload = function(){
      currentLogoImg = img;
      currentLogoDataUrl = evt.target.result;
      logoNameDisplay.textContent = t("logoSelectedPrefix") + file.name;
      removeLogoBtn.hidden = false;
      if(lastGeneratedText) generateQR(lastGeneratedText, true);
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});
removeLogoBtn.addEventListener("click", function(){
  currentLogoImg = null;
  currentLogoDataUrl = null;
  logoNameDisplay.textContent = "";
  removeLogoBtn.hidden = true;
  if(lastGeneratedText) generateQR(lastGeneratedText, true);
});

document.getElementById("clearInputBtn").addEventListener("click", function(){
  qrInput.value = "";
  qrPreview.innerHTML = '<p class="qr-placeholder">' + t("previewPlaceholder") + '</p>';
  downloadPngBtn.disabled = true;
  downloadSvgBtn.disabled = true;
  generateStatus.style.display = "none";
  lastGeneratedText = "";
  lastPngDataUrl = "";
  lastSvgBuilder = null;
  fgColorInput.value = "#000000";
  bgColorInput.value = "#ffffff";
  currentLogoImg = null;
  currentLogoDataUrl = null;
  logoNameDisplay.textContent = "";
  removeLogoBtn.hidden = true;
  qrInput.focus();
});

/* =====================================================================
   6. QR SCANNING — camera
   ===================================================================== */
var video = document.getElementById("cameraView");
var scanCanvas = document.getElementById("scanCanvas");
var scanStatus = document.getElementById("scanStatus");
var scanResultBox = document.getElementById("scanResultBox");
var copyResultBtn = document.getElementById("copyResultBtn");
var startCameraBtn = document.getElementById("startCameraBtn");
var stopCameraBtn = document.getElementById("stopCameraBtn");
var mediaStream = null;
var scanLoopId = null;

function stopCamera(){
  if(mediaStream){
    mediaStream.getTracks().forEach(function(track){ track.stop(); });
    mediaStream = null;
  }
  if(scanLoopId){ cancelAnimationFrame(scanLoopId); scanLoopId = null; }
  video.hidden = true;
  startCameraBtn.hidden = false;
  stopCameraBtn.hidden = true;
}

function handleDecodedText(text, source){
  renderLinkableText(scanResultBox, text); // clickable if it's a safe http(s) link, plain text otherwise
  copyResultBtn.disabled = false;
  showStatus(scanStatus, t("msgScanSuccess"), "success");
  addHistoryEntry("scanned", text);
  if(source === "camera") stopCamera();
}

function scanFrame(){
  if(!mediaStream) return;
  if(video.readyState === video.HAVE_ENOUGH_DATA){
    scanCanvas.width = video.videoWidth;
    scanCanvas.height = video.videoHeight;
    var ctx = scanCanvas.getContext("2d");
    ctx.drawImage(video, 0, 0, scanCanvas.width, scanCanvas.height);
    var imageData = ctx.getImageData(0, 0, scanCanvas.width, scanCanvas.height);
    // eslint-disable-next-line no-undef
    var code = jsQR(imageData.data, imageData.width, imageData.height);
    if(code && code.data){
      handleDecodedText(code.data, "camera");
      return;
    }
  }
  scanLoopId = requestAnimationFrame(scanFrame);
}

startCameraBtn.addEventListener("click", function(){
  if(!window.isSecureContext){
    showStatus(scanStatus, "Camera requires HTTPS (or localhost). Opening this file directly (file://) blocks camera access — deploy it to a web server or use the image upload option below.", "error");
    return;
  }
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    showStatus(scanStatus, t("noCamera"), "error");
    return;
  }
  loadScript(JSQR_SRC).catch(function(err){
    console.error(err);
    showStatus(scanStatus, "Could not load QR scanning library. Check your connection.", "error");
    return Promise.reject(err);
  }).then(function(){
    return navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
  }).then(function(stream){
    mediaStream = stream;
    video.srcObject = stream;
    video.hidden = false;
    startCameraBtn.hidden = true;
    stopCameraBtn.hidden = false;
    scanStatus.style.display = "none";
    var playPromise = video.play();
    if(playPromise && playPromise.catch){ playPromise.catch(function(){}); }
    scanLoopId = requestAnimationFrame(scanFrame);
  }).catch(function(err){
    if(err && err.name && /NotAllowedError|NotFoundError|NotReadableError|OverconstrainedError|SecurityError/.test(err.name)){
      showStatus(scanStatus, t("msgCameraDenied"), "error");
    }
    // Script-load errors are already reported above; avoid double messaging.
  });
});
stopCameraBtn.addEventListener("click", stopCamera);

/* =====================================================================
   7. QR SCANNING — file upload fallback
   ===================================================================== */
var MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB limit
var chooseFileBtn = document.getElementById("chooseFileBtn");
var qrFileInput = document.getElementById("qrFileInput");
var fileNameDisplay = document.getElementById("fileNameDisplay");

chooseFileBtn.addEventListener("click", function(){
  qrFileInput.click();
});

qrFileInput.addEventListener("change", function(e){
  var file = e.target.files && e.target.files[0];
  if(!file) return;

  fileNameDisplay.textContent = t("fileSelectedPrefix") + file.name;

  if(file.size > MAX_FILE_BYTES){
    showStatus(scanStatus, t("msgFileTooLarge"), "error");
    e.target.value = "";
    return;
  }
  loadScript(JSQR_SRC).then(function(){
    var reader = new FileReader();
    reader.onload = function(evt){
      var img = new Image();
      img.onload = function(){
        var c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        var ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var imageData = ctx.getImageData(0, 0, c.width, c.height);
        // eslint-disable-next-line no-undef
        var code = jsQR(imageData.data, imageData.width, imageData.height);
        if(code && code.data){
          handleDecodedText(code.data, "upload");
        } else {
          showStatus(scanStatus, t("msgScanFail"), "error");
        }
      };
      img.onerror = function(){
        showStatus(scanStatus, t("msgScanFail"), "error");
      };
      img.src = evt.target.result;
    };
    reader.onerror = function(){
      showStatus(scanStatus, t("msgScanFail"), "error");
    };
    reader.readAsDataURL(file);
  }).catch(function(err){
    console.error(err);
    showStatus(scanStatus, "Could not load QR scanning library. Check your connection.", "error");
  }).finally(function(){
    e.target.value = ""; // allow re-selecting the same file to re-trigger scanning
  });
});

copyResultBtn.addEventListener("click", function(){
  var text = scanResultBox.textContent;
  if(!text) return;
  navigator.clipboard.writeText(text).then(function(){
    showStatus(scanStatus, t("msgCopied"), "success");
  }).catch(function(){
    // Fallback for older browsers
    var range = document.createRange();
    range.selectNode(scanResultBox);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    showStatus(scanStatus, t("msgCopied"), "success");
  });
});

/* =====================================================================
   8. HISTORY (localStorage)
   ===================================================================== */
var HISTORY_KEY = "uqrt_history";
var MAX_HISTORY = 50;

function getHistory(){
  try{
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  }catch(e){ return []; }
}
function saveHistory(list){
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
}
function addHistoryEntry(type, text){
  var list = getHistory();
  list.unshift({type:type, text:text, ts:Date.now()});
  saveHistory(list);
  renderHistory();
}
function deleteHistoryEntry(index){
  var list = getHistory();
  list.splice(index, 1);
  saveHistory(list);
  renderHistory();
}
function renderHistory(){
  var list = getHistory();
  var ul = document.getElementById("historyList");
  var empty = document.getElementById("historyEmpty");
  ul.innerHTML = "";
  if(list.length === 0){
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  list.forEach(function(entry, idx){
    var li = document.createElement("li");
    li.className = "history-item";

    var meta = document.createElement("div");
    meta.className = "meta";
    var tag = document.createElement("div");
    tag.className = "tag";
    tag.textContent = (entry.type === "generated" ? t("tagGenerated") : t("tagScanned")) + " · " + new Date(entry.ts).toLocaleString(currentLang);
    var txt = document.createElement("div");
    txt.className = "text";
    renderLinkableText(txt, entry.text); // clickable if it's a safe http(s) link, plain text otherwise
    txt.title = entry.text;
    meta.appendChild(tag);
    meta.appendChild(txt);

    var actions = document.createElement("div");
    actions.className = "actions";
    var regenBtn = document.createElement("button");
    regenBtn.type = "button";
    regenBtn.textContent = t("regenerate");
    regenBtn.setAttribute("aria-label", t("regenerate") + ": " + entry.text);
    regenBtn.addEventListener("click", function(){
      qrInput.value = entry.text;
      generateQR(entry.text, true);
      window.scrollTo({top:0, behavior:"smooth"});
    });
    var delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = t("deleteEntry");
    delBtn.setAttribute("aria-label", t("deleteEntry") + ": " + entry.text);
    delBtn.addEventListener("click", function(){ deleteHistoryEntry(idx); });

    actions.appendChild(regenBtn);
    actions.appendChild(delBtn);

    li.appendChild(meta);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}
document.getElementById("clearHistoryBtn").addEventListener("click", function(){
  saveHistory([]);
  renderHistory();
});

/* =====================================================================
   9. COOKIE CONSENT + ADSENSE LOADER
   ===================================================================== */
var COOKIE_CONSENT_KEY = "uqrt_cookie_consent";

function loadAdsenseIfConsented(){
  if(!ADSENSE_CLIENT_ID) return; // not configured yet — see the CONFIG section at top of this file
  if(document.getElementById("adsbygoogle-loader")) return; // already loaded
  var s = document.createElement("script");
  s.id = "adsbygoogle-loader";
  s.async = true;
  s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + ADSENSE_CLIENT_ID;
  s.crossOrigin = "anonymous";
  s.onload = function(){
    document.querySelectorAll("ins.adsbygoogle").forEach(function(){
      try{ (window.adsbygoogle = window.adsbygoogle || []).push({}); }catch(e){ console.error(e); }
    });
  };
  document.head.appendChild(s);
}

function loadAnalyticsIfConsented(){
  if(!GA_MEASUREMENT_ID) return; // not configured yet — see the CONFIG section at top of this file
  if(window.gtag) return; // already loaded
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {anonymize_ip: true});
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
  document.head.appendChild(s);
}

function initCookieConsent(){
  var banner = document.getElementById("cookieBanner");
  var consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if(!consent){
    banner.hidden = false;
  } else if(consent === "accepted"){
    loadAdsenseIfConsented();
    loadAnalyticsIfConsented();
  }
  document.getElementById("cookieAcceptBtn").addEventListener("click", function(){
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    banner.hidden = true;
    loadAdsenseIfConsented();
    loadAnalyticsIfConsented();
  });
  document.getElementById("cookieDeclineBtn").addEventListener("click", function(){
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    banner.hidden = true;
  });
}

/* =====================================================================
   10. MOBILE ANCHOR AD (dismissible, session-only)
   ===================================================================== */
function initAnchorAd(){
  var anchorAd = document.getElementById("anchorAd");
  var closeBtn = document.getElementById("anchorAdClose");
  if(!anchorAd || !closeBtn) return;
  if(!sessionStorage.getItem("uqrt_anchor_dismissed")){
    anchorAd.classList.add("visible");
  }
  closeBtn.addEventListener("click", function(){
    anchorAd.classList.remove("visible");
    sessionStorage.setItem("uqrt_anchor_dismissed", "1");
  });
}

/* =====================================================================
   11. WIRE UP GLOBAL CONTROLS
   ===================================================================== */
document.getElementById("langSelect").addEventListener("change", function(e){
  applyLanguage(e.target.value);
});
document.getElementById("darkModeToggle").addEventListener("click", function(){
  var current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* =====================================================================
   12. INIT
   ===================================================================== */
initTheme();
applyLanguage(detectLocale());
renderHistory();
initCookieConsent();
initAnchorAd();

})();
