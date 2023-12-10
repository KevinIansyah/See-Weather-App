class EndBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <div class="footer card text-center mt-5 border-0 rounded-0">
            <div class="card-footer text-body-secondary border-top-0 border-light">
            <p class="m-0 text-light">&copySeeWeather - 2023</p>
            </div>
        </div>
    `;
  }
}

customElements.define("end-bar", EndBar);
