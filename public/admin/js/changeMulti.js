const checkboxAll = document.querySelector("[checkbox-all]");
const table = checkboxAll.closest("table");
const tbody = table.querySelector("tbody");
const checkboxSingles = tbody.querySelectorAll("[checkbox-single]");
const inputIds = document.querySelector('[name="ids"]');
let ids = [];
let checkCount = 0;

if (checkboxAll) {
  checkboxAll.addEventListener("click", () => {
    if (checkboxSingles.length > 0) {
      checkboxSingles.forEach((item) => {
        item.checked = checkboxAll.checked ? true : false;
        const id = item.getAttribute("checkbox-single");
        const index = ids.findIndex((item) => item === id);
        if (index === -1) {
          ids.push(id);
        }
        inputIds.value = ids.join(",");
      });
    }
    if (!checkboxAll.checked) {
      checkCount = 0;
      ids = [];
      inputIds.value = "";
    } else checkCount = checkboxSingles.length;
  });
}

if (checkboxSingles.length > 0) {
  checkboxSingles.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("checkbox-single");
      item.checked = !item.checked ? false : true;
      checkCount = item.checked ? checkCount + 1 : checkCount - 1;
      if (item.checked) {
        const index = ids.findIndex((item) => item === id);
        if (index === -1) {
          ids.push(id);
          inputIds.value = ids.join(",");
        }
      } else {
        const index = ids.findIndex((item) => item === id);
        if (index !== -1) {
          ids.splice(index, 1);
          inputIds.value = ids.join(",");
        }
      }
      if (checkCount === checkboxSingles.length) checkboxAll.checked = true;
      else checkboxAll.checked = false;
    });
  });
}

