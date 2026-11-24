const CHAOS_WANDER_SPEED = 1;
const BOUQUET_TRANSITION_SPEED = 1;

const PARTICLE_COUNT = window.matchMedia("(max-width: 640px)").matches ? 7600 : 13500;
const PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TELEGRAM_SENSORS_VERSION = "8.0";
const ACCELEROMETER_REFRESH_RATE_MS = 100;
const SHAKE_ACCELERATION_THRESHOLD = 15;
const SHAKE_COOLDOWN_MS = 1000;

const TAU = Math.PI * 2;
const GOLDEN_ANGLE = 2.39996;
const ORIGIN = { x: 0, y: 0 };

const BACKGROUND_COLOR = "#f5e0dc";
const CHAOS_PALETTE = ["#d77e92", "#e2b66b", "#b18cc6", "#72a18d", "#e58e78", "#86a8a5"];
const LEAF_VEIN_COLOR = "rgba(250, 246, 216, 0.38)";
const PETAL_VEIN_COLOR = "rgb(102, 100, 98)";

const SPRING_FREQUENCY = 2.1 * BOUQUET_TRANSITION_SPEED;
const SPRING_DAMPING_RATIO = 0.87;
const SPRING_STIFFNESS = SPRING_FREQUENCY ** 2;
const SPRING_DAMPING = 2 * SPRING_DAMPING_RATIO * SPRING_FREQUENCY;
const COLOR_EASING_RATE = 0.8 * SPRING_FREQUENCY;
const MAX_FRAME_DELTA_SECONDS = 0.033;

const LARGE_PARTICLE_CHANCE = 0.11;
const LARGE_PARTICLE_SCALE = 1.35;

const CHAOS_TIME_SCALE = CHAOS_WANDER_SPEED * (PREFERS_REDUCED_MOTION ? 0.25 : 1);
const CHAOS_HOME_SPREAD = 0.8;
const WANDER_WAVE_COUNT = 2;
const WANDER_AMPLITUDE_RANGE = [0.08, 0.2];
const WANDER_FREQUENCY_RANGE = [0.15, 0.5];

const BOUQUET_SWAY_FACTOR = PREFERS_REDUCED_MOTION ? 0.2 : 1;
const BOUQUET_SWAY_AMPLITUDE_RANGE = [1.4, 3.8];
const BOUQUET_SWAY_FREQUENCY_RANGE = [0.45, 0.95];

const MAX_PIXEL_RATIO = 1.25;
const BACKGROUND_PIXEL = packPixel(...hexToRgb(BACKGROUND_COLOR));
const DOT_SCALE_PER_ART_SCALE = 1.06;
const MIN_DOT_SCALE = 0.8;
const MAX_DOT_SCALE = 1.25;
const STAMP_RADIUS_COUNT = 15;
const STAMP_MIN_RADIUS = 0.45;
const STAMP_RADIUS_STEP = 0.2;
const STAMP_SUBPIXEL_STEPS = 4;
const STAMP_REACH = 4;
const STAMP_MIN_COVERAGE = 0.025;

const ART_SIZE = 800;
const ART_CENTER = ART_SIZE / 2;
const ART_VIEWPORT_FILL = 0.94;
const ART_SAMPLING_AREA = { left: 110, right: 690, top: 115, bottom: 735 };
const SAMPLE_JITTER = 0.9;

const COARSE_SAMPLING = { step: 2, alphaThreshold: 140 };
const FINE_SAMPLING = { step: 1, alphaThreshold: 75 };

const BOUQUET_LAYERS = [
    { name: "foliage", particleShare: 0.12, sampling: COARSE_SAMPLING },
    { name: "petals", particleShare: 0.54, sampling: COARSE_SAMPLING },
    { name: "outlines", particleShare: 0.25, sampling: FINE_SAMPLING },
    { name: "centers", particleShare: 0.05, sampling: FINE_SAMPLING },
    { name: "ribbon", particleShare: 0.04, sampling: COARSE_SAMPLING },
];

const SHAPE_LAYERS = [
    { name: "shapeFill", particleShare: 0.8, sampling: COARSE_SAMPLING },
    { name: "shapeOutline", particleShare: 0.2, sampling: FINE_SAMPLING },
];

const FLOWER_ANCHORS = [
    [0, 202], [-125, 258], [125, 257], [-212, 337], [212, 334],
    [-66, 390], [66, 390], [-158, 463], [158, 462], [0, 475],
    [-59, 166], [75, 164], [8, 514],
];

const FLOWER_PAINTERS = {
    rose: drawRose,
    peony: drawPeony,
    tulip: drawTulip,
    daisy: drawDaisy,
    lavender: drawLavender,
    sunflower: drawSunflower,
    poppy: drawPoppy,
    cosmos: drawCosmos,
    anemone: drawAnemone,
    dahlia: drawDahlia,
};

const BOUQUET_PRESETS = {
    rosesAndPeonies: {
        flowerKinds: ["rose", "peony"],
        flowerCount: 7,
        flowerSize: 62,
        spread: 1,
        petalColors: ["#de617d", "#f18ca2", "#f5b0bd", "#eac2c9"],
        foliageColor: "#5c8c76",
        ribbonColor: "#c77e92",
    },
    sunsetTulips: {
        flowerKinds: ["tulip"],
        flowerCount: 9,
        flowerSize: 56,
        spread: 0.97,
        petalColors: ["#e76950", "#ed9467", "#f1bf7e", "#d94f70"],
        foliageColor: "#67946b",
        ribbonColor: "#b9786c",
    },
    meadowDaisies: {
        flowerKinds: ["daisy", "cosmos"],
        flowerCount: 10,
        flowerSize: 50,
        spread: 1.02,
        petalColors: ["#fff2e1", "#f7e4ce", "#f9d5df", "#e4c7e7"],
        foliageColor: "#6e9676",
        ribbonColor: "#d6a47d",
    },
    lavenderMist: {
        flowerKinds: ["lavender", "lavender", "anemone"],
        flowerCount: 11,
        flowerSize: 48,
        spread: 0.91,
        petalColors: ["#aa85c8", "#927ab4", "#c8a6dc", "#d8b1d6"],
        foliageColor: "#6a907a",
        ribbonColor: "#a694b7",
    },
    peonyCloud: {
        flowerKinds: ["peony"],
        flowerCount: 6,
        flowerSize: 69,
        spread: 0.98,
        petalColors: ["#f4b0bf", "#f5cad1", "#ed91a8", "#ffe0dc"],
        foliageColor: "#779b81",
        ribbonColor: "#d6a0aa",
    },
    sunnyBouquet: {
        flowerKinds: ["sunflower", "daisy"],
        flowerCount: 7,
        flowerSize: 63,
        spread: 1,
        petalColors: ["#efb94d", "#f5d46a", "#e8a53f", "#fff0c6"],
        foliageColor: "#62855f",
        ribbonColor: "#bd9766",
    },
    poppiesInTheWind: {
        flowerKinds: ["poppy", "cosmos"],
        flowerCount: 8,
        flowerSize: 59,
        spread: 1.07,
        petalColors: ["#dd5462", "#ef796d", "#f49b87", "#d83c55"],
        foliageColor: "#728d73",
        ribbonColor: "#b97c74",
    },
    airyCosmos: {
        flowerKinds: ["cosmos", "daisy"],
        flowerCount: 10,
        flowerSize: 51,
        spread: 1.05,
        petalColors: ["#eeb3d0", "#f4d5e5", "#df91be", "#fff1eb"],
        foliageColor: "#719d80",
        ribbonColor: "#b992bd",
    },
    anemoneGarden: {
        flowerKinds: ["anemone", "anemone", "daisy"],
        flowerCount: 8,
        flowerSize: 59,
        spread: 1,
        petalColors: ["#e4d7ed", "#b8afd9", "#d1c5e6", "#faf2ef"],
        foliageColor: "#688d82",
        ribbonColor: "#a98da7",
    },
    summerDahlias: {
        flowerKinds: ["dahlia", "rose"],
        flowerCount: 7,
        flowerSize: 64,
        spread: 1.02,
        petalColors: ["#ee9a7c", "#efbd87", "#db7296", "#f4d0b7"],
        foliageColor: "#638c72",
        ribbonColor: "#bd8d81",
    },
};

const SHAPE_FORMING_MS = 2000 / BOUQUET_TRANSITION_SPEED;

const LOVE_MESSAGE_LINES = ["I", "Love", "You"];
const LOVE_MESSAGE_LINE_HOLD_MS = 1500;
const LOVE_MESSAGE_HEART_HOLD_MS = 2000;

const LOVE_FONT_FAMILY = "Georgia, \"Times New Roman\", serif";
const LOVE_TEXT_MAX_WIDTH = 520;
const LOVE_TEXT_MAX_FONT_SIZE = 300;
const LOVE_TEXT_OUTLINE_WIDTH = 4;

const LOVE_LIGHT_COLOR = "#f7a8bb";
const LOVE_DEEP_COLOR = "#d6416a";
const LOVE_OUTLINE_COLOR = "#9c2f54";
const LOVE_SHINE_COLOR = "#fde6ec";
const LOVE_GRADIENT_REACH = 220;

const HEART_SCALE = 13;
const HEART_CURVE_MIDDLE_Y = -2.5;
const HEART_OUTLINE_STEPS = 240;
const HEART_OUTLINE_WIDTH = 5;
const HEART_SHINE = { x: ART_CENTER - 117, y: ART_CENTER - 136, radiusX: 34, radiusY: 18, rotation: -0.7 };

const SHOWS = [
    ...Object.values(BOUQUET_PRESETS).map(createBouquetShow),
    createLoveMessageShow(),
];

window.addEventListener("DOMContentLoaded", () => {
    startApp(document.querySelector("canvas"));
});

function startApp(canvas) {
    const scene = createScene(canvas);

    resizeScene(scene);
    window.addEventListener("resize", () => resizeScene(scene), { passive: true });

    setupTelegram(() => showNextBouquet(scene));
    canvas.addEventListener("click", () => scatterBouquet(scene));

    requestAnimationFrame(timestamp => animate(scene, timestamp));
}

function createScene(canvas) {
    return {
        renderer: createRenderer(canvas),
        artLayers: createArtLayers(),
        particles: createParticles(),
        viewport: null,
        clock: { time: 0, lastTimestamp: null },
        isShowingBouquet: false,
        lastShow: null,
        nextFrameTimeoutId: null,
    };
}

function resizeScene(scene) {
    const previousViewport = scene.viewport;

    scene.viewport = measureViewport();
    resizeRenderer(scene.renderer, scene.viewport);

    if (hasArea(previousViewport)) {
        rescaleParticles(scene.particles, previousViewport, scene.viewport);
    } else {
        placeParticlesInChaos(scene.particles, scene.viewport);
    }
}

function measureViewport() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
        width,
        height,
        pixelRatio: Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO),
        artScale: Math.min(width, height) / ART_SIZE * ART_VIEWPORT_FILL,
    };
}

function hasArea(viewport) {
    return Boolean(viewport?.width && viewport?.height);
}

function showNextBouquet(scene) {
    const show = pickShowOtherThan(scene.lastShow);

    scene.lastShow = show;
    playFrame(scene, show, 0);
}

function playFrame(scene, show, frameIndex) {
    const isShowFinished = frameIndex === show.length;

    if (isShowFinished) {
        scatterBouquet(scene);
        return;
    }

    const frame = show[frameIndex];

    formShape(scene, frame);
    scheduleNextFrame(scene, show, frameIndex, frame.holdMs);
}

function formShape(scene, frame) {
    const points = generateFramePoints(scene.artLayers, frame);

    assignBouquetTargets(scene.particles, points);
    scene.isShowingBouquet = true;
}

function scheduleNextFrame(scene, show, frameIndex, holdMs) {
    clearTimeout(scene.nextFrameTimeoutId);

    if (Number.isFinite(holdMs)) {
        const frameDurationMs = SHAPE_FORMING_MS + holdMs;

        scene.nextFrameTimeoutId = setTimeout(() => playFrame(scene, show, frameIndex + 1), frameDurationMs);
    }
}

function pickShowOtherThan(excludedShow) {
    const candidates = SHOWS.filter(show => show !== excludedShow);

    return pickRandom(candidates);
}

function createBouquetShow(preset) {
    return [
        { layers: BOUQUET_LAYERS, paint: artLayers => paintBouquet(artLayers, preset), holdMs: Infinity },
    ];
}

function createLoveMessageShow() {
    const lineFrames = LOVE_MESSAGE_LINES.map(line => ({
        layers: SHAPE_LAYERS,
        paint: artLayers => paintMessageLine(artLayers, line),
        holdMs: LOVE_MESSAGE_LINE_HOLD_MS,
    }));

    const heartFrame = { layers: SHAPE_LAYERS, paint: paintHeart, holdMs: LOVE_MESSAGE_HEART_HOLD_MS };

    return [...lineFrames, heartFrame];
}

function scatterBouquet(scene) {
    clearTimeout(scene.nextFrameTimeoutId);

    if (!scene.isShowingBouquet) {
        return;
    }

    scene.isShowingBouquet = false;

    for (const particle of scene.particles) {
        particle.targetColor = randomChaosColor();
    }
}

function animate(scene, timestamp) {
    const deltaTime = advanceClock(scene.clock, timestamp);

    updateParticles(scene, deltaTime);
    drawParticles(scene.renderer, scene.viewport, scene.particles);

    requestAnimationFrame(nextTimestamp => animate(scene, nextTimestamp));
}

function advanceClock(clock, timestamp) {
    const elapsedSeconds = (timestamp - (clock.lastTimestamp ?? timestamp)) / 1000;
    const deltaTime = Math.min(elapsedSeconds, MAX_FRAME_DELTA_SECONDS);

    clock.lastTimestamp = timestamp;
    clock.time += deltaTime;

    return deltaTime;
}

function setupTelegram(onShake) {
    const webApp = window.Telegram?.WebApp;

    if (!webApp) {
        return;
    }

    webApp.ready();
    webApp.expand();

    if (webApp.isVersionAtLeast(TELEGRAM_SENSORS_VERSION)) {
        webApp.lockOrientation();
        listenForShakes(webApp, onShake);
    }
}

function listenForShakes(webApp, onShake) {
    const shakeDetector = { previousAcceleration: null, lastShakeTime: -Infinity };

    webApp.onEvent("accelerometerChanged", () => {
        if (detectShake(shakeDetector, readAcceleration(webApp.Accelerometer))) {
            onShake();
        }
    });

    webApp.Accelerometer.start({ refresh_rate: ACCELEROMETER_REFRESH_RATE_MS });
}

function readAcceleration(accelerometer) {
    return { x: accelerometer.x, y: accelerometer.y, z: accelerometer.z };
}

function detectShake(detector, acceleration) {
    const now = performance.now();
    const isJolt = isSharpAccelerationChange(detector.previousAcceleration, acceleration);
    const isCoolingDown = now - detector.lastShakeTime < SHAKE_COOLDOWN_MS;

    detector.previousAcceleration = acceleration;

    if (!isJolt || isCoolingDown) {
        return false;
    }

    detector.lastShakeTime = now;

    return true;
}

function isSharpAccelerationChange(previous, current) {
    if (!previous) {
        return false;
    }

    const change = Math.hypot(current.x - previous.x, current.y - previous.y, current.z - previous.z);

    return change > SHAKE_ACCELERATION_THRESHOLD;
}

function createParticles() {
    return Array.from({ length: PARTICLE_COUNT }, createParticle);
}

function createParticle() {
    const color = randomChaosColor();

    return {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        bouquetX: ART_CENTER,
        bouquetY: ART_CENTER,
        depth: 0,
        color,
        targetColor: [...color],
        radius: randomParticleRadius(),
        homeX: randomBetween(-CHAOS_HOME_SPREAD, CHAOS_HOME_SPREAD),
        homeY: randomBetween(-CHAOS_HOME_SPREAD, CHAOS_HOME_SPREAD),
        wanderX: createWanderWaves(),
        wanderY: createWanderWaves(),
        swayPhase: Math.random() * TAU,
        swayFrequency: randomBetween(...BOUQUET_SWAY_FREQUENCY_RANGE),
        swayAmplitude: randomBetween(...BOUQUET_SWAY_AMPLITUDE_RANGE),
    };
}

function createWanderWaves() {
    return Array.from({ length: WANDER_WAVE_COUNT }, () => ({
        amplitude: randomBetween(...WANDER_AMPLITUDE_RANGE),
        frequency: randomBetween(...WANDER_FREQUENCY_RANGE),
        phase: Math.random() * TAU,
    }));
}

function randomParticleRadius() {
    const scale = Math.random() < LARGE_PARTICLE_CHANCE ? LARGE_PARTICLE_SCALE : 1;

    return randomBetween(0.92, 1.6) * scale;
}

function placeParticlesInChaos(particles, viewport) {
    for (const particle of particles) {
        Object.assign(particle, chaosPosition(particle, viewport, 0));
    }
}

function rescaleParticles(particles, previousViewport, viewport) {
    const scaleX = viewport.width / previousViewport.width;
    const scaleY = viewport.height / previousViewport.height;

    for (const particle of particles) {
        particle.x = (particle.x - previousViewport.width / 2) * scaleX + viewport.width / 2;
        particle.y = (particle.y - previousViewport.height / 2) * scaleY + viewport.height / 2;
        particle.velocityX = 0;
        particle.velocityY = 0;
    }
}

function assignBouquetTargets(particles, points) {
    particles.forEach((particle, index) => {
        const point = points[index];

        particle.bouquetX = point.x;
        particle.bouquetY = point.y;
        particle.targetColor = point.color;
        particle.depth = point.depth;
    });

    particles.sort((first, second) => first.depth - second.depth);
}

function updateParticles(scene, deltaTime) {
    const springStep = createSpringStep(deltaTime);
    const colorEasing = 1 - Math.exp(-COLOR_EASING_RATE * deltaTime);

    for (const particle of scene.particles) {
        const target = targetPosition(particle, scene);

        pullTowards(particle, target, springStep, deltaTime);
        easeColor(particle, colorEasing);
    }
}

function createSpringStep(deltaTime) {
    return {
        pull: SPRING_STIFFNESS * deltaTime,
        damping: Math.exp(-SPRING_DAMPING * deltaTime),
    };
}

function targetPosition(particle, scene) {
    return scene.isShowingBouquet
        ? bouquetPosition(particle, scene.viewport, scene.clock.time)
        : chaosPosition(particle, scene.viewport, scene.clock.time);
}

function chaosPosition(particle, viewport, time) {
    const { width, height } = viewport;
    const wanderTime = time * CHAOS_TIME_SCALE;
    const wanderScale = Math.min(width, height) / 2;

    return {
        x: width / 2 * (1 + particle.homeX) + sumWaves(particle.wanderX, wanderTime) * wanderScale,
        y: height / 2 * (1 + particle.homeY) + sumWaves(particle.wanderY, wanderTime) * wanderScale,
    };
}

function sumWaves(waves, time) {
    let total = 0;

    for (const wave of waves) {
        total += wave.amplitude * Math.sin(time * wave.frequency + wave.phase);
    }

    return total;
}

function bouquetPosition(particle, viewport, time) {
    const { width, height, artScale } = viewport;
    const sway = particle.swayAmplitude * artScale * BOUQUET_SWAY_FACTOR;

    return {
        x: width / 2
            + (particle.bouquetX - ART_CENTER) * artScale
            + Math.sin(time * particle.swayFrequency + particle.swayPhase) * sway,
        y: height / 2
            + (particle.bouquetY - ART_CENTER) * artScale
            + Math.cos(time * particle.swayFrequency * 0.73 + particle.swayPhase * 1.7) * sway,
    };
}

function pullTowards(particle, target, { pull, damping }, deltaTime) {
    particle.velocityX = (particle.velocityX + (target.x - particle.x) * pull) * damping;
    particle.velocityY = (particle.velocityY + (target.y - particle.y) * pull) * damping;

    particle.x += particle.velocityX * deltaTime;
    particle.y += particle.velocityY * deltaTime;
}

function easeColor(particle, easing) {
    for (let channel = 0; channel < 3; channel++) {
        particle.color[channel] += (particle.targetColor[channel] - particle.color[channel]) * easing;
    }
}

function createArtLayers() {
    const layers = [...BOUQUET_LAYERS, ...SHAPE_LAYERS];

    return Object.fromEntries(layers.map(layer => [layer.name, createArtContext()]));
}

function createArtContext() {
    const canvas = document.createElement("canvas");

    canvas.width = ART_SIZE;
    canvas.height = ART_SIZE;

    return canvas.getContext("2d", { willReadFrequently: true });
}

function generateFramePoints(artLayers, frame) {
    clearArtLayers(artLayers);
    frame.paint(artLayers);

    return shuffle(sampleLayers(artLayers, frame.layers));
}

function paintBouquet(artLayers, preset) {
    const flowers = layoutFlowers(preset);

    drawFoliage(artLayers.foliage, flowers, preset.foliageColor);
    flowers.forEach(flower => drawFlower(artLayers, flower));
    drawRibbon(artLayers.ribbon, preset.ribbonColor);
}

function clearArtLayers(artLayers) {
    for (const context of Object.values(artLayers)) {
        context.clearRect(0, 0, ART_SIZE, ART_SIZE);
    }
}

function layoutFlowers(preset) {
    return FLOWER_ANCHORS.slice(0, preset.flowerCount).map(([offsetX, y], index) => ({
        index,
        x: ART_CENTER + offsetX * preset.spread + randomBetween(-11, 11),
        y: y + randomBetween(-12, 12),
        angle: randomBetween(-0.25, 0.25),
        radius: preset.flowerSize * randomBetween(0.84, 1.13),
        kind: pickCyclic(preset.flowerKinds, index),
        color: pickCyclic(preset.petalColors, index),
    }));
}

function sampleLayers(artLayers, layers) {
    const quotas = splitParticlesBetweenLayers(layers);

    return layers.flatMap((layer, depth) =>
        sampleLayerPoints(artLayers[layer.name], layer.sampling, quotas[depth], depth),
    );
}

function splitParticlesBetweenLayers(layers) {
    const quotas = layers.map(layer => Math.round(PARTICLE_COUNT * layer.particleShare));

    quotas[quotas.length - 1] += PARTICLE_COUNT - sum(quotas);

    return quotas;
}

function sampleLayerPoints(context, sampling, quantity, depth) {
    const pixels = context.getImageData(0, 0, ART_SIZE, ART_SIZE).data;
    const visibleOffsets = findVisiblePixelOffsets(pixels, sampling);

    return Array.from({ length: quantity }, () => createPointFromPixel(pixels, pickRandom(visibleOffsets), depth));
}

function findVisiblePixelOffsets(pixels, { step, alphaThreshold }) {
    const offsets = [];

    for (let y = ART_SAMPLING_AREA.top; y < ART_SAMPLING_AREA.bottom; y += step) {
        for (let x = ART_SAMPLING_AREA.left; x < ART_SAMPLING_AREA.right; x += step) {
            const offset = (y * ART_SIZE + x) * 4;

            if (pixels[offset + 3] > alphaThreshold) {
                offsets.push(offset);
            }
        }
    }

    return offsets;
}

function createPointFromPixel(pixels, offset, depth) {
    const pixelIndex = offset / 4;

    return {
        x: (pixelIndex % ART_SIZE) + randomBetween(-SAMPLE_JITTER, SAMPLE_JITTER),
        y: Math.floor(pixelIndex / ART_SIZE) + randomBetween(-SAMPLE_JITTER, SAMPLE_JITTER),
        color: [pixels[offset], pixels[offset + 1], pixels[offset + 2]],
        depth,
    };
}

function drawFoliage(context, flowers, foliageColor) {
    context.lineCap = "round";

    for (const flower of flowers) {
        drawStem(context, flower, foliageColor);
        drawStemLeaves(context, flower, foliageColor);
    }

    for (const side of [-1, 1]) {
        drawSideBranch(context, side, foliageColor);
    }
}

function drawStem(context, flower, foliageColor) {
    context.strokeStyle = mixColors(foliageColor, "#385e52", (flower.index % 4) * 0.08);
    context.lineWidth = 5 + (flower.index % 3);

    strokeCubicCurve(context, stemCurve(flower));
}

function drawStemLeaves(context, flower, foliageColor) {
    for (const stemProgress of [0.33, 0.54]) {
        const isLeftLeaf = (flower.index + Math.round(stemProgress * 10)) % 2 === 0;
        const { x, y } = cubicBezierPoint(stemCurve(flower), stemProgress);

        const leaf = {
            x,
            y,
            angle: isLeftLeaf ? -Math.PI * 0.78 : -Math.PI * 0.22,
            length: randomBetween(45, 79),
        };
        const color = mixColors(foliageColor, isLeftLeaf ? "#b3c9a1" : "#466e5b", 0.16 + (flower.index % 3) * 0.1);

        drawLeaf(context, leaf, color);
    }
}

function stemCurve(flower) {
    return [
        { x: flower.x, y: flower.y + 15 },
        { x: flower.x * 0.7 + ART_CENTER * 0.3, y: 395 },
        { x: ART_CENTER + (flower.x - ART_CENTER) * 0.08, y: 545 },
        { x: ART_CENTER + (flower.index - 5) * 2.3, y: 697 },
    ];
}

function drawSideBranch(context, side, foliageColor) {
    const branch = [
        { x: ART_CENTER + side * 13, y: 629 },
        { x: ART_CENTER + side * 132, y: 440 },
        { x: ART_CENTER + side * 228, y: 351 },
    ];

    context.strokeStyle = foliageColor;
    context.lineWidth = 4;
    strokeQuadraticCurve(context, branch);

    for (let leafIndex = 0; leafIndex < 4; leafIndex++) {
        const { x, y } = quadraticBezierPoint(branch, 0.25 + leafIndex * 0.17);

        const leaf = {
            x,
            y,
            angle: side < 0 ? -2.55 : -0.6,
            length: 43 + leafIndex * 4,
        };
        const color = mixColors(foliageColor, "#b3c6a5", 0.1 + leafIndex * 0.07);

        drawLeaf(context, leaf, color);
    }
}

function drawLeaf(context, leaf, color) {
    saveAndTransform(context, leaf);

    fillLeafBlade(context, leaf.length, color);
    strokeLeafVein(context, leaf.length);

    context.restore();
}

function fillLeafBlade(context, length, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(0, 0);
    context.bezierCurveTo(length * 0.3, -length * 0.48, length * 0.72, -length * 0.28, length, 0);
    context.bezierCurveTo(length * 0.65, length * 0.35, length * 0.23, length * 0.3, 0, 0);
    context.fill();
}

function strokeLeafVein(context, length) {
    context.strokeStyle = LEAF_VEIN_COLOR;
    context.lineWidth = 1.5;

    strokeQuadraticCurve(context, [
        { x: 3, y: 0 },
        { x: length * 0.5, y: -length * 0.08 },
        { x: length * 0.88, y: 0 },
    ]);
}

function drawFlower(artLayers, flower) {
    const flowerLayers = [artLayers.petals, artLayers.outlines, artLayers.centers];

    flowerLayers.forEach(context => saveAndTransform(context, flower));
    FLOWER_PAINTERS[flower.kind](artLayers, flower.radius, flower.color);
    flowerLayers.forEach(context => context.restore());
}

function drawRose(layers, radius, color) {
    drawPetalRings(layers, radius, color, [
        { count: 9, length: 1, width: 0.55, shift: 0.1, tone: 0.1 },
        { count: 8, length: 0.7, width: 0.47, shift: 0.28, tone: 0.26 },
        { count: 6, length: 0.44, width: 0.36, shift: 0.12, tone: 0.1 },
    ]);

    const bud = { x: 0, y: 1, radiusX: radius * 0.12, radiusY: radius * 0.09 };

    fillEllipse(layers.petals, bud, mixColors(color, "#80405a", 0.45));
    strokeRoseSpiral(layers.centers, radius, mixColors(color, "#753b53", 0.77));
}

function strokeRoseSpiral(context, radius, color) {
    const steps = 90;

    context.strokeStyle = color;
    context.lineWidth = Math.max(1.7, radius * 0.058);
    context.lineCap = "round";
    context.beginPath();

    for (let step = 0; step <= steps; step++) {
        const progress = step / steps;
        const { x, y } = polarPoint(progress * Math.PI * 4.3, radius * (0.025 + 0.29 * progress));

        context.lineTo(x, y);
    }

    context.stroke();
}

function drawPeony(layers, radius, color) {
    drawPetalRings(layers, radius, color, [
        { count: 12, length: 1.04, width: 0.58, tone: 0.12 },
        { count: 11, length: 0.79, width: 0.51, shift: 0.16, tone: 0.25 },
        { count: 9, length: 0.56, width: 0.42, shift: 0.04, tone: 0.09 },
        { count: 7, length: 0.35, width: 0.33, shift: 0.2, tone: 0.26 },
    ]);

    fillDots(layers.petals, pointsOnCircle(6, radius * 0.11), radius * 0.035, "#e9bb78");

    drawFilaments(layers.centers, radius, {
        count: 13,
        innerDistance: 0.04,
        outerDistance: 0.21,
        color: "#a96d5b",
        tipColor: "#ffdc86",
    });
}

function drawTulip(layers, radius, color) {
    const outlineColor = mixColors(color, "#7b4153", 0.4);
    const leftPetal = { x: -radius * 0.25, y: radius * 0.32, angle: -0.19, width: radius * 0.34, length: radius * 1.18 };
    const rightPetal = { ...leftPetal, x: radius * 0.25, angle: 0.19 };

    fillTulipCup(layers.petals, radius, mixColors(color, "#6e3350", 0.14));

    fillPetal(layers.petals, leftPetal, color);
    outlinePetal(layers.outlines, leftPetal, outlineColor);

    fillPetal(layers.petals, rightPetal, mixColors(color, "#ffffff", 0.18));
    outlinePetal(layers.outlines, rightPetal, outlineColor);

    strokeTulipCrease(layers.centers, radius, mixColors(color, "#813b55", 0.7));
}

function fillTulipCup(context, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(-radius * 0.7, radius * 0.38);
    context.quadraticCurveTo(-radius * 0.94, -radius * 0.78, -radius * 0.38, -radius * 0.67);
    context.quadraticCurveTo(-radius * 0.12, -radius * 0.38, 0, -radius * 0.61);
    context.quadraticCurveTo(radius * 0.17, -radius * 0.92, radius * 0.37, -radius * 0.6);
    context.quadraticCurveTo(radius * 0.91, -radius * 0.82, radius * 0.7, radius * 0.33);
    context.quadraticCurveTo(0, radius * 0.94, -radius * 0.7, radius * 0.38);
    context.fill();
}

function strokeTulipCrease(context, radius, color) {
    context.strokeStyle = color;
    context.lineWidth = radius * 0.055;

    strokeQuadraticCurve(context, [
        { x: 0, y: radius * 0.45 },
        { x: -radius * 0.06, y: -radius * 0.21 },
        { x: -radius * 0.05, y: -radius * 0.65 },
    ]);
}

function drawDaisy(layers, radius, color) {
    drawPetalRings(layers, radius, color, [
        { count: 15, length: 0.99, width: 0.2, tone: 0.09 },
    ]);

    fillCircle(layers.petals, ORIGIN, radius * 0.23, "#e7b84e");
    fillDots(layers.petals, scatteredPointsOnCircle(9, radius * 0.15), radius * 0.024, "#a87942");

    drawFilaments(layers.centers, radius, {
        count: 20,
        innerDistance: 0.05,
        outerDistance: 0.21,
        color: "#bb8b38",
        tipColor: "#704e30",
    });
}

function drawLavender(layers, radius, color) {
    strokeLavenderStem(layers.petals, radius);

    for (let budIndex = 0; budIndex < 17; budIndex++) {
        drawLavenderBud(layers, radius, color, budIndex);
    }
}

function strokeLavenderStem(context, radius) {
    context.strokeStyle = "#668b75";
    context.lineWidth = radius * 0.09;
    context.beginPath();
    context.moveTo(0, radius * 0.76);
    context.lineTo(0, -radius * 1.3);
    context.stroke();
}

function drawLavenderBud(layers, radius, color, budIndex) {
    const side = budIndex % 2 ? 1 : -1;
    const offset = side * (1 - budIndex / 20) * radius * 0.32;
    const y = radius * 0.34 - budIndex * radius * 0.095;
    const rotation = side * 0.55;

    const bud = { x: offset * 0.68, y, radiusX: radius * 0.13, radiusY: radius * 0.21, rotation };
    const budColor = budIndex % 3 ? color : mixColors(color, "#f1d4ee", 0.3);

    const budShade = { x: offset * 0.73, y: y - radius * 0.045, radiusX: radius * 0.055, radiusY: radius * 0.11, rotation };
    const budShadeColor = mixColors(color, "#67437c", 0.42);

    fillEllipse(layers.petals, bud, budColor);
    fillEllipse(layers.centers, budShade, budShadeColor);
}

function drawSunflower(layers, radius, color) {
    drawPetalRings(layers, radius, color, [
        { count: 19, length: 1.1, width: 0.22, tone: 0.02 },
        { count: 17, length: 0.84, width: 0.2, shift: 0.14, tone: 0.2 },
    ]);

    fillCircle(layers.petals, ORIGIN, radius * 0.36, "#694d37");
    fillDots(layers.petals, pointsOnGoldenSpiral(26, radius * 0.31), radius * 0.026, "#a57949");
    fillDots(layers.centers, pointsOnGoldenSpiral(115, radius * 0.34), radius * 0.019, "#d0a15c");
}

function drawPoppy(layers, radius, color) {
    drawPetalRings(layers, radius, color, [
        { count: 5, length: 1, width: 0.72, tone: 0.07 },
        { count: 5, length: 0.8, width: 0.57, shift: 0.25, tone: 0.17 },
    ]);

    fillCircle(layers.petals, ORIGIN, radius * 0.25, "#484250");
    strokeRays(layers.petals, pointsOnCircle(10, radius * 0.29), "#dbc49b");

    drawFilaments(layers.centers, radius, {
        count: 17,
        innerDistance: 0.04,
        outerDistance: 0.34,
        color: "#282d39",
        tipColor: "#e3c9a0",
    });
}

function drawCosmos(layers, radius, color) {
    drawPetalRings(layers, radius, color, [
        { count: 8, length: 1.05, width: 0.42, tone: 0.09 },
    ]);

    fillCircle(layers.petals, ORIGIN, radius * 0.18, "#e7b15c");

    drawFilaments(layers.centers, radius, {
        count: 11,
        innerDistance: 0.05,
        outerDistance: 0.18,
        color: "#b97d48",
        tipColor: "#e9cd7b",
    });
}

function drawAnemone(layers, radius, color) {
    drawPetalRings(layers, radius, color, [
        { count: 7, length: 1.08, width: 0.61, tone: 0.08 },
        { count: 7, length: 0.75, width: 0.47, shift: 0.12, tone: 0.22 },
    ]);

    fillCircle(layers.petals, ORIGIN, radius * 0.27, "#464b6c");
    fillDots(layers.petals, pointsOnCircle(12, radius * 0.24), radius * 0.026, "#d6c7a5");

    drawFilaments(layers.centers, radius, {
        count: 26,
        innerDistance: 0.14,
        outerDistance: 0.34,
        color: "#313c59",
        tipColor: "#d7c7aa",
    });
}

function drawDahlia(layers, radius, color) {
    drawPetalRings(layers, radius, color, [
        { count: 17, length: 1.07, width: 0.29, tone: 0.08 },
        { count: 15, length: 0.82, width: 0.27, shift: 0.11, tone: 0.25 },
        { count: 12, length: 0.57, width: 0.25, shift: 0.23, tone: 0.12 },
        { count: 9, length: 0.34, width: 0.22, shift: 0.09, tone: 0.24 },
    ]);

    fillCircle(layers.centers, ORIGIN, radius * 0.11, mixColors(color, "#f7e9d6", 0.55));
}

function drawPetalRings(layers, radius, color, rings) {
    rings.forEach((ring, ringIndex) => {
        const style = petalRingStyle(color, ring, ringIndex, rings.length);

        ringPetals(ring, radius).forEach((petal, petalIndex) => {
            fillPetal(layers.petals, petal, style.fillColor);

            if ((petalIndex + ringIndex) % style.outlineEvery === 0) {
                outlinePetal(layers.outlines, petal, style.outlineColor);
            }
        });
    });
}

function petalRingStyle(color, ring, ringIndex, ringCount) {
    const isInnermostRing = ringIndex === ringCount - 1;

    return {
        fillColor: mixColors(color, ringIndex % 2 ? "#ffffff" : "#b65270", ring.tone ?? 0),
        outlineColor: mixColors(color, "#71485c", ringIndex === 0 ? 0.34 : 0.46),
        outlineEvery: isInnermostRing ? 2 : 3,
    };
}

function ringPetals(ring, radius) {
    return Array.from({ length: ring.count }, (_, petalIndex) => ({
        x: 0,
        y: 0,
        angle: petalIndex * TAU / ring.count + (ring.shift ?? 0),
        width: radius * ring.width,
        length: radius * ring.length,
    }));
}

function fillPetal(context, petal, color) {
    saveAndTransform(context, petal);

    context.fillStyle = color;
    tracePetal(context, petal);
    context.fill();

    context.restore();
}

function outlinePetal(context, petal, color) {
    saveAndTransform(context, petal);

    strokePetalEdge(context, petal, color);
    strokePetalVein(context, petal);

    context.restore();
}

function strokePetalEdge(context, petal, color) {
    context.strokeStyle = color;
    context.lineWidth = Math.max(1.25, petal.width * 0.09);
    context.lineCap = "round";
    context.lineJoin = "round";

    tracePetal(context, petal);
    context.stroke();
}

function strokePetalVein(context, petal) {
    context.strokeStyle = PETAL_VEIN_COLOR;
    context.lineWidth = Math.max(0.9, petal.width * 0.055);

    strokeQuadraticCurve(context, [
        { x: 0, y: -petal.length * 0.1 },
        { x: petal.width * 0.12, y: -petal.length * 0.48 },
        { x: 0, y: -petal.length * 0.84 },
    ]);
}

function tracePetal(context, { width, length }) {
    context.beginPath();
    context.moveTo(0, 4);
    context.bezierCurveTo(-width * 0.85, -length * 0.23, -width * 0.78, -length * 0.82, 0, -length);
    context.bezierCurveTo(width * 0.8, -length * 0.86, width * 0.86, -length * 0.25, 0, 4);
    context.closePath();
}

function drawFilaments(context, radius, filaments) {
    context.lineWidth = Math.max(1.1, radius * 0.025);
    context.lineCap = "round";

    for (let index = 0; index < filaments.count; index++) {
        drawFilament(context, radius, index * TAU / filaments.count, filaments);
    }
}

function drawFilament(context, radius, angle, { innerDistance, outerDistance, color, tipColor }) {
    const base = polarPoint(angle, radius * innerDistance);
    const tip = polarPoint(angle, radius * outerDistance);
    const sideways = polarPoint(angle + Math.PI / 2, radius * 0.04);
    const bend = { x: tip.x * 0.8 + sideways.x, y: tip.y * 0.8 + sideways.y };

    context.strokeStyle = color;
    strokeQuadraticCurve(context, [base, bend, tip]);

    fillCircle(context, tip, radius * 0.027, tipColor);
}

function strokeRays(context, ends, color) {
    context.strokeStyle = color;
    context.lineWidth = 2;

    for (const end of ends) {
        context.beginPath();
        context.moveTo(ORIGIN.x, ORIGIN.y);
        context.lineTo(end.x, end.y);
        context.stroke();
    }
}

function drawRibbon(context, color) {
    context.lineCap = "round";
    context.lineJoin = "round";

    strokeRibbonBow(context, color);
    strokeRibbonTails(context, mixColors(color, "#ffffff", 0.22));
    fillEllipse(context, { x: 400, y: 601, radiusX: 17, radiusY: 13 }, mixColors(color, "#874c62", 0.2));
}

function strokeRibbonBow(context, color) {
    context.strokeStyle = color;
    context.lineWidth = 18;
    context.beginPath();
    context.moveTo(400, 599);
    context.bezierCurveTo(352, 547, 325, 574, 364, 603);
    context.bezierCurveTo(385, 614, 400, 599, 400, 599);
    context.bezierCurveTo(449, 549, 473, 573, 436, 605);
    context.bezierCurveTo(416, 613, 400, 599, 400, 599);
    context.stroke();
}

function strokeRibbonTails(context, color) {
    context.strokeStyle = color;
    context.lineWidth = 12;

    strokeQuadraticCurve(context, [{ x: 397, y: 609 }, { x: 368, y: 644 }, { x: 359, y: 674 }]);
    strokeQuadraticCurve(context, [{ x: 404, y: 610 }, { x: 436, y: 640 }, { x: 445, y: 663 }]);
}

function paintMessageLine(artLayers, line) {
    const { shapeFill, shapeOutline } = artLayers;
    const font = loveFont(fitFontSize(shapeFill, line));

    shapeFill.font = font;
    shapeOutline.font = font;

    const position = centeredTextPosition(shapeFill, line);

    fillMessageText(shapeFill, line, position);
    strokeMessageText(shapeOutline, line, position);
}

function loveFont(size) {
    return `italic bold ${size}px ${LOVE_FONT_FAMILY}`;
}

function fitFontSize(context, line) {
    context.font = loveFont(LOVE_TEXT_MAX_FONT_SIZE);

    const { actualBoundingBoxLeft, actualBoundingBoxRight } = context.measureText(line);
    const widthAtMaxSize = actualBoundingBoxLeft + actualBoundingBoxRight;

    return Math.min(LOVE_TEXT_MAX_FONT_SIZE, LOVE_TEXT_MAX_FONT_SIZE * LOVE_TEXT_MAX_WIDTH / widthAtMaxSize);
}

function centeredTextPosition(context, line) {
    const metrics = context.measureText(line);

    return {
        x: ART_CENTER + (metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) / 2,
        y: ART_CENTER + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2,
    };
}

function fillMessageText(context, line, position) {
    context.fillStyle = createLoveGradient(context);
    context.fillText(line, position.x, position.y);
}

function strokeMessageText(context, line, position) {
    context.strokeStyle = LOVE_OUTLINE_COLOR;
    context.lineWidth = LOVE_TEXT_OUTLINE_WIDTH;
    context.lineJoin = "round";
    context.strokeText(line, position.x, position.y);
}

function paintHeart(artLayers) {
    const outline = heartOutline();

    fillPolygon(artLayers.shapeFill, outline, createLoveGradient(artLayers.shapeFill));
    fillEllipse(artLayers.shapeFill, HEART_SHINE, LOVE_SHINE_COLOR);

    artLayers.shapeOutline.lineJoin = "round";
    strokePolygon(artLayers.shapeOutline, outline, LOVE_OUTLINE_COLOR, HEART_OUTLINE_WIDTH);
}

function heartOutline() {
    return Array.from({ length: HEART_OUTLINE_STEPS }, (_, step) => heartPoint(step / HEART_OUTLINE_STEPS * TAU));
}

function heartPoint(angle) {
    const curveX = 16 * Math.sin(angle) ** 3;
    const curveY = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);

    return {
        x: ART_CENTER + curveX * HEART_SCALE,
        y: ART_CENTER - (curveY - HEART_CURVE_MIDDLE_Y) * HEART_SCALE,
    };
}

function createLoveGradient(context) {
    const start = ART_CENTER - LOVE_GRADIENT_REACH;
    const end = ART_CENTER + LOVE_GRADIENT_REACH;
    const gradient = context.createLinearGradient(start, start, end, end);

    gradient.addColorStop(0, LOVE_LIGHT_COLOR);
    gradient.addColorStop(1, LOVE_DEEP_COLOR);

    return gradient;
}

function saveAndTransform(context, { x, y, angle }) {
    context.save();
    context.translate(x, y);
    context.rotate(angle);
}

function fillCircle(context, center, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, TAU);
    context.fill();
}

function fillDots(context, centers, radius, color) {
    for (const center of centers) {
        fillCircle(context, center, radius, color);
    }
}

function fillEllipse(context, { x, y, radiusX, radiusY, rotation = 0 }, color) {
    context.fillStyle = color;
    context.beginPath();
    context.ellipse(x, y, radiusX, radiusY, rotation, 0, TAU);
    context.fill();
}

function fillPolygon(context, points, color) {
    context.fillStyle = color;
    tracePolygon(context, points);
    context.fill();
}

function strokePolygon(context, points, color, lineWidth) {
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    tracePolygon(context, points);
    context.stroke();
}

function tracePolygon(context, points) {
    context.beginPath();

    for (const point of points) {
        context.lineTo(point.x, point.y);
    }

    context.closePath();
}

function strokeQuadraticCurve(context, [start, control, end]) {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.quadraticCurveTo(control.x, control.y, end.x, end.y);
    context.stroke();
}

function strokeCubicCurve(context, [start, firstControl, secondControl, end]) {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.bezierCurveTo(firstControl.x, firstControl.y, secondControl.x, secondControl.y, end.x, end.y);
    context.stroke();
}

function polarPoint(angle, distance) {
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
}

function pointsOnCircle(count, distance) {
    return Array.from({ length: count }, (_, index) => polarPoint(index * TAU / count, distance));
}

function scatteredPointsOnCircle(count, distance) {
    return Array.from({ length: count }, (_, index) => polarPoint(index * GOLDEN_ANGLE, distance));
}

function pointsOnGoldenSpiral(count, maxDistance) {
    return Array.from({ length: count }, (_, index) =>
        polarPoint(index * GOLDEN_ANGLE, Math.sqrt((index + 0.5) / count) * maxDistance),
    );
}

function quadraticBezierPoint([start, control, end], progress) {
    const rest = 1 - progress;

    return {
        x: rest * rest * start.x + 2 * rest * progress * control.x + progress * progress * end.x,
        y: rest * rest * start.y + 2 * rest * progress * control.y + progress * progress * end.y,
    };
}

function cubicBezierPoint([start, firstControl, secondControl, end], progress) {
    const rest = 1 - progress;
    const startWeight = rest * rest * rest;
    const firstControlWeight = 3 * rest * rest * progress;
    const secondControlWeight = 3 * rest * progress * progress;
    const endWeight = progress * progress * progress;

    return {
        x: startWeight * start.x + firstControlWeight * firstControl.x + secondControlWeight * secondControl.x + endWeight * end.x,
        y: startWeight * start.y + firstControlWeight * firstControl.y + secondControlWeight * secondControl.y + endWeight * end.y,
    };
}

function createRenderer(canvas) {
    return {
        canvas,
        context: canvas.getContext("2d", { alpha: false }),
        dotStamps: createDotStamps(),
        imageData: null,
        pixels: null,
        width: 0,
        height: 0,
    };
}

function resizeRenderer(renderer, viewport) {
    renderer.width = Math.max(1, Math.round(viewport.width * viewport.pixelRatio));
    renderer.height = Math.max(1, Math.round(viewport.height * viewport.pixelRatio));

    renderer.canvas.width = renderer.width;
    renderer.canvas.height = renderer.height;

    renderer.imageData = renderer.context.createImageData(renderer.width, renderer.height);
    renderer.pixels = new Uint32Array(renderer.imageData.data.buffer);
}

function drawParticles(renderer, viewport, particles) {
    const { pixelRatio } = viewport;
    const dotScale = clamp(viewport.artScale * DOT_SCALE_PER_ART_SCALE, MIN_DOT_SCALE, MAX_DOT_SCALE) * pixelRatio;

    renderer.pixels.fill(BACKGROUND_PIXEL);

    for (const particle of particles) {
        drawDot(renderer, particle.x * pixelRatio, particle.y * pixelRatio, particle.radius * dotScale, particle.color);
    }

    renderer.context.putImageData(renderer.imageData, 0, 0);
}

function drawDot(renderer, x, y, radius, color) {
    const pixelX = Math.floor(x);
    const pixelY = Math.floor(y);
    const stamp = findDotStamp(renderer.dotStamps, radius, x - pixelX, y - pixelY);

    applyDotStamp(renderer, stamp, pixelX, pixelY, color);
}

function findDotStamp(stamps, radius, subpixelOffsetX, subpixelOffsetY) {
    const lastSubpixel = STAMP_SUBPIXEL_STEPS - 1;
    const radiusIndex = clamp(Math.round((radius - STAMP_MIN_RADIUS) / STAMP_RADIUS_STEP), 0, STAMP_RADIUS_COUNT - 1);
    const subpixelX = clamp(Math.floor(subpixelOffsetX * STAMP_SUBPIXEL_STEPS), 0, lastSubpixel);
    const subpixelY = clamp(Math.floor(subpixelOffsetY * STAMP_SUBPIXEL_STEPS), 0, lastSubpixel);

    return stamps[(radiusIndex * STAMP_SUBPIXEL_STEPS + subpixelY) * STAMP_SUBPIXEL_STEPS + subpixelX];
}

function applyDotStamp(renderer, stamp, originX, originY, color) {
    const { pixels, width, height } = renderer;
    const red = color[0] | 0;
    const green = color[1] | 0;
    const blue = color[2] | 0;

    for (const stampPixel of stamp) {
        const x = originX + decodeStampOffsetX(stampPixel);
        const y = originY + decodeStampOffsetY(stampPixel);

        if (x >= 0 && x < width && y >= 0 && y < height) {
            const index = y * width + x;

            pixels[index] = blendPixel(pixels[index], red, green, blue, decodeStampAlpha(stampPixel));
        }
    }
}

function createDotStamps() {
    const stamps = [];

    for (let radiusIndex = 0; radiusIndex < STAMP_RADIUS_COUNT; radiusIndex++) {
        const radius = STAMP_MIN_RADIUS + radiusIndex * STAMP_RADIUS_STEP;

        for (let subpixelY = 0; subpixelY < STAMP_SUBPIXEL_STEPS; subpixelY++) {
            for (let subpixelX = 0; subpixelX < STAMP_SUBPIXEL_STEPS; subpixelX++) {
                stamps.push(createDotStamp(radius, subpixelCenter(subpixelX), subpixelCenter(subpixelY)));
            }
        }
    }

    return stamps;
}

function subpixelCenter(subpixel) {
    return (subpixel + 0.5) / STAMP_SUBPIXEL_STEPS;
}

function createDotStamp(radius, centerX, centerY) {
    const stampPixels = [];

    for (let offsetY = -STAMP_REACH; offsetY <= STAMP_REACH; offsetY++) {
        for (let offsetX = -STAMP_REACH; offsetX <= STAMP_REACH; offsetX++) {
            const distance = Math.hypot(offsetX + 0.5 - centerX, offsetY + 0.5 - centerY);
            const coverage = clamp(radius + 0.5 - distance, 0, 1);

            if (coverage > STAMP_MIN_COVERAGE) {
                stampPixels.push(encodeStampPixel(Math.round(coverage * 255), offsetX, offsetY));
            }
        }
    }

    return new Uint16Array(stampPixels);
}

function encodeStampPixel(alpha, offsetX, offsetY) {
    return (alpha << 8) | ((offsetY + STAMP_REACH) << 4) | (offsetX + STAMP_REACH);
}

function decodeStampAlpha(stampPixel) {
    return stampPixel >> 8;
}

function decodeStampOffsetX(stampPixel) {
    return (stampPixel & 15) - STAMP_REACH;
}

function decodeStampOffsetY(stampPixel) {
    return ((stampPixel >> 4) & 15) - STAMP_REACH;
}

function blendPixel(background, red, green, blue, alpha) {
    if (alpha === 255) {
        return packPixel(red, green, blue);
    }

    const backgroundAlpha = 255 - alpha;

    return packPixel(
        (red * alpha + (background & 255) * backgroundAlpha) >> 8,
        (green * alpha + ((background >> 8) & 255) * backgroundAlpha) >> 8,
        (blue * alpha + ((background >> 16) & 255) * backgroundAlpha) >> 8,
    );
}

function packPixel(red, green, blue) {
    return 0xff000000 | (blue << 16) | (green << 8) | red;
}

function hexToRgb(hex) {
    const value = Number.parseInt(hex.slice(1), 16);

    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function mixColors(baseHex, tintHex, amount) {
    const base = hexToRgb(baseHex);
    const tint = hexToRgb(tintHex);
    const mixed = base.map((channel, index) => Math.round(channel + (tint[index] - channel) * amount));

    return `rgb(${mixed.join(", ")})`;
}

function randomChaosColor() {
    return hexToRgb(pickRandom(CHAOS_PALETTE));
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function pickCyclic(items, index) {
    return items[index % items.length];
}

function shuffle(items) {
    for (let index = items.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));

        [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }

    return items;
}

function sum(values) {
    return values.reduce((total, value) => total + value, 0);
}
