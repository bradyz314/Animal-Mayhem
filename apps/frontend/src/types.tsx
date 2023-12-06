export interface Bullet {
    imgPath: string,
    radius: number,
    pos: [number, number],
    speed: number,
    acceleration: number,
    direction: number,
}

export interface AttackPattern {
    duration: number,
    getBullets: () => Bullet[],
    spawnTime: number,
}

export interface LevelData {
    levelNo: number,
    enemyData: {
        imgPath: string,
        name: string,
        maxHealth: number,
        attack: number,
        defense: number,
        selectedSkills: string[],
    },
    coinReward: number,
}

export interface SkillEffectInfo {
    targetSelf: boolean,
    stat: string,
    scaling: number[], // Scaling : ATK, DEF, HP
}

export interface SkillInfo {
    name: string,
    description: string,
    cost?: number,
    patternIndex?: number,
    effects: SkillEffectInfo[]
}

