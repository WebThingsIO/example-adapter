(function() {
  class ExampleExtension extends window.Extension {
    constructor() {
      super('example-adapter');

      this.content = '';
      fetch(`/extensions/${this.id}/views/content.html`)
        .then((res) => res.text())
        .then((text) => {
          this.content = text;
        })
        .catch((e) => console.error('Failed to fetch content:', e));
    }

    show(context) {
      this.showBackButton('/things');
      this.view.innerHTML = this.content;

      const params = new URLSearchParams(context.querystring);
      const thingId = params.get('thingId');

      if (!thingId) {
        return;
      }

      const description = document.getElementById(
        'extension-example-adapter-thing-description'
      );

      window.API.getJson(
        // eslint-disable-next-line max-len
        `/extensions/${this.id}/api/thing-description?thingId=${encodeURIComponent(thingId)}`
      ).then((body) => {
        description.innerText = JSON.stringify(body, null, 2);
      }).catch((e) => {
        description.innerText = e.toString();
      });
    }
  }

  new ExampleExtension();
})();
