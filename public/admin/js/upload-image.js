// upload-image
const uploadImage = document.querySelector("[image-upload-input]");
if (uploadImage) {
  uploadImage.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const previewImage = document.querySelector(".preview-image");
    if (previewImage.querySelector(".img-thumbnail")) {
      previewImage.removeChild(previewImage.querySelector(".img-thumbnail"));
    }
    if (previewImage) {
      const image = document.createElement("img");
      const url = URL.createObjectURL(file);
      image.src = url;
      const html = `
        <div class="image-preview-item">
          <img src=${url} class="my-2 img-thumbnail" width="200" height="200" />
          <span class="image-preview-close">
            <i class="fa-solid fa-xmark"></i>
          </span>
        </div>
      `;
      previewImage.innerHTML = html;
      previewImage
        .querySelector(".image-preview-close")
        .addEventListener("click", () => {
          previewImage.removeChild(
            previewImage.querySelector(".image-preview-item")
          );
        });
    }
  });
}

