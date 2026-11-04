// ==========================================
// 1. CANVAS
// ==========================================

const canvas = document.getElementById("flowerCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 900;

// ==========================================
// 2. CORES
// ==========================================

const colors = {
    pink: ["#ff167f", "#ff3297", "#f94ca8", "#ff70b8"],
    pinkLight: ["#ff9bcf", "#ffd0e8"],
    green: ["#00a875", "#10ce91", "#42e6a2"],
    greenLight: ["#a5f5a9", "#d4ffb5"]
};

const baseY = 870;

// ==========================================
// 3. CONFIGURAÇÃO DO BUQUÊ
// ==========================================

const bouquet = [
    { x: 105, y: 205, baseX: 190, size: 1.00, delay: 0 },
    { x: 245, y: 115, baseX: 255, size: 1.08, delay: 0.5 },
    { x: 390, y: 205, baseX: 380, size: 0.98, delay: 1 },
    { x: 310, y: 340, baseX: 310, size: 0.88, delay: 1.5 },
    { x: 475, y: 440, baseX: 420, size: 0.92, delay: 2 }
];

// ==========================================
// 4. FUNÇÕES AUXILIARES
// ==========================================

function random(min, max) {
    return min + Math.random() * (max - min);
}

function clamp(value) {
    return Math.max(0, Math.min(value, 1));
}

function smooth(value) {
    value = clamp(value);
    return value * value * (3 - 2 * value);
}

function chooseColor(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function particle(x, y, palette, size = 1.2) {
    return {
        x,
        y,
        color: chooseColor(palette),
        size,
        alpha: random(0.65, 1),
        glow: random(1.5, 3.5)
    };
}

// ==========================================
// 5. DESENHO DAS PARTÍCULAS
// ==========================================

function drawParticle(p, opacity = 1) {
    ctx.globalAlpha = p.alpha * opacity;
    ctx.shadowBlur = p.glow;
    ctx.shadowColor = p.color;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

    ctx.fillStyle = p.color;
    ctx.fill();

    ctx.shadowBlur = 0;
}

// ==========================================
// 6. CAULES CURVOS
// ==========================================

function stemPosition(flower, t) {
    const curve = Math.sin(t * Math.PI) * 15;

    return {
        x: flower.baseX +
            (flower.x - flower.baseX) * t +
            curve,

        y: baseY +
            (flower.y + 25 - baseY) * t
    };
}

function createStem(flower) {
    const points = [];

    for (let i = 0; i <= 260; i++) {
        const t = i / 260;
        const center = stemPosition(flower, t);

        for (let j = -1; j <= 1; j++) {
            points.push({
                t,
                p: particle(
                    center.x + j * 1.7 + random(-0.7, 0.7),
                    center.y + random(-0.8, 0.8),
                    colors.green,
                    random(0.9, 1.5)
                )
            });
        }
    }

    return points;
}

// ==========================================
// 7. GEOMETRIA DAS PÉTALAS
// ==========================================

// Cada pétala nasce na base do botão e
// afunila até uma ponta própria.

function petalPosition(flower, shape, u, t, opening) {
    const size = flower.size * 76;

    const widthProfile = Math.pow(
        Math.sin(Math.PI * Math.pow(t, 0.82)),
        0.72
    );

    const width = size * shape.width * widthProfile;

    const tipShift = shape.tipShift * t * t;

    const centerShift =
        shape.curve * Math.sin(t * Math.PI);

    const openShift =
        shape.openDirection * opening * t * 13;

    const x =
        flower.x +
        shape.offset * size * 0.24 +
        tipShift +
        centerShift +
        openShift +
        u * width;

    const y =
        flower.y +
        14 -
        t * size * shape.height +
        Math.abs(u) * Math.abs(u) * t * 5;

    return { x, y };
}

// ==========================================
// 8. FORMATO DAS PÉTALAS
// ==========================================

// Três pétalas principais e duas laterais.
// As pontas não ficam alinhadas: isso cria
// a silhueta característica do botão de tulipa.

const petalShapes = [
    {
        offset: -0.55,
        width: 0.35,
        height: 0.91,
        tipShift: -12,
        curve: -5,
        openDirection: -1,
        layer: 0
    },
    {
        offset: 0.55,
        width: 0.35,
        height: 0.91,
        tipShift: 12,
        curve: 5,
        openDirection: 1,
        layer: 0
    },
    {
        offset: 0,
        width: 0.34,
        height: 1.12,
        tipShift: 0,
        curve: 0,
        openDirection: 0,
        layer: 0
    },
    {
        offset: -0.27,
        width: 0.31,
        height: 1.00,
        tipShift: -8,
        curve: -3,
        openDirection: -0.7,
        layer: 1
    },
    {
        offset: 0.27,
        width: 0.31,
        height: 1.00,
        tipShift: 8,
        curve: 3,
        openDirection: 0.7,
        layer: 1
    }
];

// ==========================================
// 9. CRIAÇÃO DAS PÉTALAS
// ==========================================

function createPetals() {
    return petalShapes.map(shape => {
        const points = [];

        // Partículas distribuídas sobre a superfície
        for (let i = 0; i < 700; i++) {
            const t = random(0.025, 0.975);
            const u = random(-0.96, 0.96);

            const edge = Math.abs(u);

            const palette = edge > 0.82
                ? colors.pinkLight
                : colors.pink;

            points.push({
                t,
                u,
                p: particle(
                    0,
                    0,
                    palette,
                    random(0.8, 1.35)
                )
            });
        }

        // Contornos laterais mais delicados
        const outline = [];

        for (let i = 0; i <= 70; i++) {
            const t = i / 70;

            outline.push({ t, u: -1 });
            outline.push({ t, u: 1 });
        }

        return { shape, points, outline };
    }).sort((a, b) => a.shape.layer - b.shape.layer);
}

// ==========================================
// 10. FOLHAS
// ==========================================

// Curva quadrática para construir a nervura
// central de cada folha.

function leafCenter(start, control, end, t) {
    const inverse = 1 - t;

    return {
        x:
            inverse * inverse * start.x +
            2 * inverse * t * control.x +
            t * t * end.x,

        y:
            inverse * inverse * start.y +
            2 * inverse * t * control.y +
            t * t * end.y
    };
}

function leafPosition(leaf, t, u) {
    const center = leafCenter(
        leaf.start,
        leaf.control,
        leaf.end,
        t
    );

    const before = leafCenter(
        leaf.start,
        leaf.control,
        leaf.end,
        Math.max(0, t - 0.01)
    );

    const after = leafCenter(
        leaf.start,
        leaf.control,
        leaf.end,
        Math.min(1, t + 0.01)
    );

    const dx = after.x - before.x;
    const dy = after.y - before.y;
    const length = Math.hypot(dx, dy);

    const normalX = -dy / length;
    const normalY = dx / length;

    // Largura máxima no meio e pontas agudas
    const profile = Math.pow(
        Math.sin(Math.PI * t),
        0.85
    );

    const width = leaf.width * profile;

    // Curvatura da superfície
    const curve = u * width;

    return {
        x: center.x + normalX * curve,
        y: center.y + normalY * curve -
            Math.abs(u) * Math.abs(u) * 3
    };
}

function createLeaf(start, control, end, width) {
    const leaf = {
        start,
        control,
        end,
        width
    };

    const points = [];
    const vein = [];

    // Interior da folha
    for (let i = 0; i < 850; i++) {
        const t = random(0.02, 0.98);
        const u = random(-0.96, 0.96);

        const position = leafPosition(leaf, t, u);

        points.push({
            t,
            p: particle(
                position.x + random(-0.5, 0.5),
                position.y + random(-0.5, 0.5),
                Math.abs(u) > 0.8
                    ? colors.greenLight
                    : colors.green,
                random(0.75, 1.3)
            )
        });
    }

    // Nervura central
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const position = leafPosition(leaf, t, 0);

        vein.push({
            t,
            p: particle(
                position.x,
                position.y,
                colors.greenLight,
                1.1
            )
        });
    }

    return { ...leaf, points, vein };
}

// ==========================================
// 11. PREPARAÇÃO DAS FLORES
// ==========================================

const flowers = bouquet.map(flower => {
    const scale = flower.size;

    // Folhas em alturas diferentes no caule.
    // Uma folha longa para cada lado.

    const leaves = [
        createLeaf(
            { x: flower.baseX, y: baseY - 100 },
            { x: flower.baseX - 30, y: baseY - 260 },
            { x: flower.baseX - 100, y: baseY - 390 },
            22
        ),

        createLeaf(
            { x: flower.baseX, y: baseY - 220 },
            { x: flower.baseX + 30, y: baseY - 360 },
            { x: flower.baseX + 105, y: baseY - 480 },
            21
        )
    ];

    return {
        ...flower,
        stem: createStem(flower),
        leaves,
        petals: createPetals()
    };
});

// ==========================================
// 12. DESENHO DOS CAULES
// ==========================================

function drawStem(flower, growth) {
    for (const point of flower.stem) {
        if (point.t <= growth) {
            drawParticle(point.p);
        }
    }
}

// ==========================================
// 13. DESENHO DAS FOLHAS
// ==========================================

function drawLeaves(flower, growth) {
    flower.leaves.forEach((leaf, index) => {
        const start = index === 0 ? 0.20 : 0.38;

        const progress = smooth(
            (growth - start) / 0.35
        );

        for (const point of leaf.points) {
            if (point.t <= progress) {
                drawParticle(point.p);
            }
        }

        for (const point of leaf.vein) {
            if (point.t <= progress) {
                drawParticle(point.p, 0.8);
            }
        }
    });
}

// ==========================================
// 14. DESENHO DAS PÉTALAS
// ==========================================

function drawPetals(flower, opening, visibility) {
    for (const petal of flower.petals) {

        // Superfície
        for (const point of petal.points) {
            const position = petalPosition(
                flower,
                petal.shape,
                point.u,
                point.t,
                opening
            );

            point.p.x = position.x;
            point.p.y = position.y;

            drawParticle(point.p, visibility);
        }

        // Contornos
        for (const point of petal.outline) {
            const position = petalPosition(
                flower,
                petal.shape,
                point.u,
                point.t,
                opening
            );

            const outlineParticle = {
                x: position.x,
                y: position.y,
                color: "#ff9bd0",
                size: 1.05,
                alpha: 0.8,
                glow: 2
            };

            drawParticle(outlineParticle, visibility);
        }
    }
}

// ==========================================
// 15. PARTÍCULAS DO FUNDO
// ==========================================

const sparkles = [];

for (let i = 0; i < 90; i++) {
    sparkles.push(
        particle(
            random(20, 580),
            random(30, 870),
            colors.pinkLight,
            random(0.4, 0.9)
        )
    );
}

function drawSparkles() {
    for (const p of sparkles) {
        drawParticle(p, 0.35);
    }
}

// ==========================================
// 16. ANIMAÇÃO DE CADA TULIPA
// ==========================================

function drawFlower(flower, elapsed) {
    const localTime = Math.max(
        0,
        elapsed - flower.delay * 1000
    );

    // Caule crescendo
    const growth = smooth(localTime / 3500);

    // Botão surgindo
    const visibility = smooth(
        (localTime - 3000) / 900
    );

    // Pétalas abrindo
    const bloom = smooth(
        (localTime - 4200) / 3000
    );

    drawStem(flower, growth);
    drawLeaves(flower, growth);

    if (visibility > 0) {
        drawPetals(flower, bloom, visibility);
    }
}

// ==========================================
// 17. DESENHO DO BUQUÊ
// ==========================================

function drawBouquet(elapsed) {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawSparkles();

    for (const flower of flowers) {
        drawFlower(flower, elapsed);
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
}

// ==========================================
// 18. ANIMAÇÃO PRINCIPAL
// ==========================================

let startTime = null;

function animate(timestamp) {
    if (startTime === null) {
        startTime = timestamp;
    }

    const elapsed = timestamp - startTime;

    drawBouquet(elapsed);

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);