const canvas = document.getElementById("flowerCanvas");

const ctx = canvas.getContext("2d");

ctx.beginPath();

ctx.arc(250, 200, 80, 0, Math.PI * 2);

ctx.fillStyle = "pink";

ctx.fill();