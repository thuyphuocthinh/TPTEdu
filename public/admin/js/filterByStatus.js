const inputs = document.querySelectorAll('[name="filter"]');
if(inputs.length) {
    inputs.forEach(input => {
        input.addEventListener("change", () => {
            const value = input.value;
            const url = new URL(window.location.href);
            if (value === "all") {
                url.searchParams.delete("filterByStatus");
            } else {
                url.searchParams.set("filterByStatus", value);
            }
            window.location.href = url.href;
        })
    })
}