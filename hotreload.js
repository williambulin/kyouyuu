(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));

  let resourceMap = new Map();

  let windowUrl = new URL(window.location.href);
  for (const resource of window.performance.getEntriesByType("resource")) {
    if (!resource.name.endsWith('.css') && !resource.name.endsWith('.js'))
      continue;

    let resourceUrl = new URL(resource.name);
    if (windowUrl.host == resourceUrl.host)
      resourceMap.set(resource.name, null);
  };

  resourceMap.set(window.location.href, null);

  // console.log(window.performance.getEntriesByType("resource"));
  // console.log(resourceMap);

  setInterval(async () => {
    for (const [key, value] of resourceMap) {
      let response = await fetch(key, { cache: 'no-store', method: 'HEAD' });
      let lastModified = new Date(response.headers.get('Last-Modified'));
      // console.log(key, response.status, lastModified);
      if (value != null && lastModified > value) {
        console.log(`${key} has been modified`);
        location.reload();
      }
      resourceMap.set(key, lastModified);
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }, 1000);
})();
