tinymce.init({
  selector: "textarea.textarea-mce",
  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "help",
    "wordcount",
  ],
  toolbar:
    "undo redo | blocks | " +
    "bold italic backcolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | help",
  file_picker_callback: (cb, value, meta) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.addEventListener("change", (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        /*
            Note: Now we need to register the blob in TinyMCEs image blob
            registry. In the next release this part hopefully won't be
            necessary, as we are looking to handle it internally.
          */
        const id = "blobid" + new Date().getTime();
        const blobCache = tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(",")[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        /* call the callback and populate the Title field with the file name */
        cb(blobInfo.blobUri(), { title: file.name });
      });
      reader.readAsDataURL(file);
    });

    input.click();
  },
  setup: (editor) => {
    const input = document.querySelector(".textarea-mce");
    const parent = input.closest(".form-group");
    const errorMsg = parent.querySelector(".error-msg");
    editor.on("input", (e) => {
      const {data} = e;
      if (!data) {
        errorMsg.innerHTML = "Không được để trống trường này";
      } else {
        errorMsg.innerHTML = "";
      }
    });
  },
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
});
