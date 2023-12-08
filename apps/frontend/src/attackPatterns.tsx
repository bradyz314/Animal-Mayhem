import { AttackPattern, Bullet } from "./types";
import { RootState, store } from "./app/store";

const generateBulletImagePath = () => {
    const bulletColor = Math.floor(Math.random() * 3);
    return bulletColor === 0 ? '/bullets/red.png' : (
        bulletColor === 1 ? '/bullets/blue.png' : '/bullets/green.png');
}

const getRandomPosition = () => {
    return [Math.random() * 400, Math.random() * 200];
}

const getRandomSpeed = () => {
    return Math.floor(Math.random() * 50) + 50
}

const generateRandomBullet = () => {
    return {
        imgPath: generateBulletImagePath(),
        radius: Math.floor(Math.random() * 20) + 10,
        pos: getRandomPosition(),
        speed: getRandomSpeed(),
        acceleration: Math.random() * 100,
        direction: Math.random() * 2 * Math.PI,
    } as Bullet
};

const generateVerticalColumn = (start: boolean) => {
    const state: RootState = store.getState();
    const radius = state.dodge.playerDimensions[1] + (state.dodge.areaDimensions[1] % state.dodge.playerDimensions[1]);
    const colX = start ? 0 : state.dodge.areaDimensions[0] - radius - 5;
    const numOfBullets = Math.floor((state.dodge.areaDimensions[1] === 0 ? 250 : state.dodge.areaDimensions[1]) / radius);
    const bulletToRemove = Math.floor(Math.random() * numOfBullets);
    const column: Bullet[] = [];
    for (let i = 0; i < numOfBullets; i++) {
        if (i !== bulletToRemove) {
            column.push({
                imgPath: generateBulletImagePath(),
                radius,
                pos: [colX, i * radius],
                speed: 80,
                acceleration: 0.1,
                direction: !start ? Math.PI : 0,
            });
        }
    }
    return column;
}

const generateRandomSpread = () => {
    const [x, y] = getRandomPosition();
    const spread: Bullet[] = [];
    const imgPath = generateBulletImagePath();
    const numOfBullets = Math.floor(Math.random() * 5) + 6;
    const deltaDegree = (Math.PI * 2) / numOfBullets;
    for (let i = 0; i < numOfBullets; i++) {
        spread.push({
            imgPath,
            radius: 20,
            pos: [x, y],
            speed: 80,
            acceleration: 0.2,
            direction: deltaDegree * i
        })
    }
    return spread;
}

const randomBullets: AttackPattern = {
    duration: 3500,
    spawnTime: 1500,
    getBullets: () => {
        const numOfBullets = Math.floor(Math.random() * 6) + 13;
        return [...Array(numOfBullets)].map(() => generateRandomBullet());
    }
}

const spawnWalls: AttackPattern = {
    duration: 6000,
    spawnTime: 1000,
    getBullets: () => {
        const rand = Math.random();
        return generateVerticalColumn(rand <= 0.50);
    }
}

const spawnSpread: AttackPattern = {
    duration: 4500,
    spawnTime: 1500,
    getBullets: () => {
        let bullets: Bullet[] = [];
        for (let i = 0; i < 3; i++) {
            bullets = bullets.concat(generateRandomSpread());
        }
        return bullets;
    }
}

const bulletRain: AttackPattern = {
    duration: 4000,
    spawnTime: 1000,
    getBullets: () => {
        const bullets: Bullet[] = [];
        const state: RootState = store.getState();
        const radius = state.dodge.playerDimensions[1] + (state.dodge.areaDimensions[1] % state.dodge.playerDimensions[1]);
        const numOfBullets = Math.floor(Math.random() * 10) + 6;
        for (let i = 0; i < numOfBullets; i++) {
            const x = Math.random() * (state.dodge.areaDimensions[0] - radius)
            bullets.push({
                imgPath: generateBulletImagePath(),
                radius: 15,
                pos: [x, radius],
                speed: -70,
                acceleration: 0.15,
                direction: (Math.random() * (Math.PI / 3)) + (4 * Math.PI / 3)  
            });
        }
        return bullets;
    }
}

const patterns: AttackPattern[] = [
    randomBullets,
    spawnWalls,
    spawnSpread,
    bulletRain
]

export default patterns;