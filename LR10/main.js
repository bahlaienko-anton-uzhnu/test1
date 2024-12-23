var displayedImage = document.querySelector('.displayed-img');
var thumbBar = document.querySelector('.thumb-bar');
var btn = document.querySelector('button');
var overlay = document.querySelector('.overlay');

/* Looping through images */
for (var i = 1; i <= 5; i++) {
    var newImage = document.createElement('img');
    newImage.setAttribute('src', 'images/pic' + i + '.jpg');
    thumbBar.appendChild(newImage);

    // Adding onclick handler to each thumbnail
    newImage.onclick = function() {
        var imgSrc = this.getAttribute('src');
        displayedImage.setAttribute('src', imgSrc);
    }
}

/* Wiring up the Darken/Lighten button */
btn.onclick = function() {
    if (btn.getAttribute('class') === 'dark') {
        btn.setAttribute('class', 'light');
        btn.textContent = 'Lighten';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    } else {
        btn.setAttribute('class', 'dark');
        btn.textContent = 'Darker';
        overlay.style.backgroundColor = 'rgba(0,0,0,0)';
    }
}
