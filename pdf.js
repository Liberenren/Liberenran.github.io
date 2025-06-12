
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  document.addEventListener('DOMContentLoaded', () => {
    const url = 'img/小6国語.pdf';

    const loadingTask = pdfjsLib.getDocument({
      url: url,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true
    });

    loadingTask.promise.then(function(pdf) {
      pdf.getPage(1).then(function(page) {
        const scale = 2.0;
        const viewport = page.getViewport({ scale });

        const canvas = document.getElementById('pdf-canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        page.render(renderContext);
      });
    }).catch(console.error);
  });