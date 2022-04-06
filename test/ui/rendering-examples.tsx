describe("Initial render", () => {
  // I was hoping to render jsx to jsdom but it looks to hard. 
  // Consider using real browser instead.
  it.skip("can't get jsx to render", () => {
    // const { window } = new JSDOM(`<body><div id="application"></div></body>`, { });

    // mount(
    //   window.document.getElementById("application"),
    //   new Application(PortsBuilder.blank().build())
    // );
  });
});
