// Générer le header
async function generateHeader() {
    const user = configurationFileContent.header.user;
    const repository = configurationFileContent.header.repository;
    const template = configurationFileContent.header.template;

    let headerTemplate = await getHtmlFile(template);
    headerTemplate = headerTemplate
      .replace(/{{user}}/, user)
      .replace(/{{repository}}/, repository);

    document.getElementById("header").innerHTML = headerTemplate;
  }

  // Initialisé le blog
  async function initBlog(navItems) {
    currentPage = document.getElementById("nav__list").firstElementChild;
    currentPage.classList.toggle("nav__item--selected");
    document.getElementById("replacable").innerHTML = await getHtmlFile(
      navItems[0].template
    );
  }

  // Charger le fichier de configuration
  async function loadConfigurationFile() {
    configurationFileContent = await fetch("config.json").then((res) =>
      res.json()
    );
  }

  // Récupèrer le contenu d'un fichier HTML
  async function getHtmlFile(url) {
    return await fetch(url).then((res) => res.text());
  }

  // Générer le menu de navigation
  async function generateNavigation(navItems, inFolder = false) {
    const navigationItemTemplate = await fetch(
      "template/navigation_item.html"
    ).then((res) => res.text());
    const navigationList = document.getElementById("nav__list");
    navigationList.innerHTML = "";
    if (inFolder) {
      const templateH = await fetch(
        "template/navigation_back.html"
      ).then((res) => res.text());
      const htmlToDOM = document.createElement(null);
      htmlToDOM.innerHTML = templateH;
      const firstChild = htmlToDOM.firstChild;
      firstChild.addEventListener("click", async () => {
        await generateNavigation(
          configurationFileContent.navigationItems,
          false
        );
        initBlog(configurationFileContent.navigationItems);
      });
      navigationList.appendChild(htmlToDOM.firstChild);
    }

    for (const item of navItems) {
      let html = navigationItemTemplate
        .replace(/{{icon}}/, item.navigation ? "folder" : "description")
        .replace(/{{content}}/, item.content)
        .replace(/{{message}}/, item.message)
        .replace(/{{age}}/, item.age);

      const htmlToDOM = document.createElement(null);
      htmlToDOM.innerHTML = html;
      const firstChild = htmlToDOM.firstChild;
      firstChild.addEventListener("click", async () => {
        if (item.navigation) {
          await generateNavigation(item.navigation, true);
          initBlog(item.navigation);
          return;
        }
        const container = document.getElementById("replacable");
        container.innerHTML = await getHtmlFile(item.template);
        firstChild.classList.toggle("nav__item--selected");
        currentPage.classList.toggle("nav__item--selected");
        currentPage = firstChild;
      });
      navigationList.appendChild(htmlToDOM.firstChild);
    }
  }

  async function initGithubButton(callback){
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://buttons.github.io/buttons.js';
    script.onload = function() {
        callback();
    }
    document.body.appendChild(script);
  }