class MainController
{
    static VARIATION = 20;
    static EXTRA_HEIGHT = 169;
    static EXTRA_WIDTH = 230;

    static init() {
        document.body.addEventListener('mouseover', MainController.handleMouseover, false);
    }

    static getPreview(url) {
        return new Promise((resolve) => {
            fetch(url, { cache: 'force-cache' })
                .then(response => response.text())
                .then(data => {
                    // Obtenemos la preview de la ficha
                    const dom = new DOMParser().parseFromString(data, 'text/html');
                    const img = dom.documentElement.querySelector('.imghover--visible > img');

                    if (!img) resolve(null);

                    resolve(img.outerHTML);
                })
                .catch(() => resolve(null));
        });
    }

    static generatePreview(image, mousePositionX, mousePositionY, websiteHeight, websiteWidth) {
        const imgPreview = document.createElement('DIV');
        
        imgPreview.classList.add('img-preview');
        imgPreview.style.zIndex = 99999;
        imgPreview.style.position = 'absolute';
        imgPreview.style.cursor = 'not-allowed';

        document.body.append(imgPreview);

        imgPreview.style.marginLeft = mousePositionX + 'px';
        imgPreview.style.marginTop = mousePositionY + 'px';

        imgPreview.innerHTML = image;

        // Si la preview no tiene espacio ajustamos su posición
        const { width: imgWidth, height: imgHeight } = imgPreview.getBoundingClientRect();

        const finalImgX = imgWidth + mousePositionX;
        const finalImgY = imgHeight + mousePositionY;

        if (websiteWidth && websiteWidth < finalImgX) {
            imgPreview.style.marginLeft = (websiteWidth - imgWidth - MainController.VARIATION) + 'px';
        }

        if (websiteHeight && websiteHeight < finalImgY) {
            imgPreview.style.marginTop = (websiteHeight - imgHeight - MainController.VARIATION) + 'px';
        }
    }
    
    static handleMouseover(ev) {
        // Guardamos el elemento y la posición del mouse
        const targetElement = ev.target;
        const mousePositionX = ev.pageX + MainController.VARIATION;
        const mousePositionY = ev.pageY;

        // Comprobamos que el enlace de la preview es válido
        const isVisualNovelLink = targetElement.nodeName === 'A' && targetElement.href.includes('vndb.org/v');

        // Dimensiones de la web, para ajustar la posición de la preview
        const { width: baseWidth, height: baseHeight } = document.querySelector("main").getBoundingClientRect();

        const websiteHeight = baseHeight + MainController.EXTRA_HEIGHT;
        const websiteWidth = baseWidth + MainController.EXTRA_WIDTH;

        // Si hacemos hover en los enlaces mostramos la preview
        if (isVisualNovelLink) {
            clearTimeout(window.timeoutPreview);

            window.timeoutPreview = setTimeout(async () => {
                const image = await MainController.getPreview(targetElement.href);

                // Eliminamos el tittle para que no moleste al ver la preview
                targetElement.removeAttribute('title');

                document.querySelectorAll('.img-preview').forEach(element => element.remove());

                MainController.generatePreview(image, mousePositionX, mousePositionY, websiteHeight, websiteWidth);
            }, 100);
        }
    }
}
