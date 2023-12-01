export type Stat = 'ATK' | 'HP' | 'DEF'

export interface Skill {
    name: string,
    targetSelf: boolean,
    statToChange: Stat,
    additionalEffect: Skill | null,
    getValue: (userAtk: number) => number,
    pattern?: AttackPattern,
}

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
}

export interface EntityData {
    name: string,
    isPlayer: boolean,
    imgPath: string,
    maxHealth: number,
    attack: number,
    defense: number,
    skills: Skill[],
}