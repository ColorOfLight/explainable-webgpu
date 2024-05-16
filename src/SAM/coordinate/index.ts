import * as SAM from "@site/src/SAM";

interface SphericalCoordinateOptions {
  maxInclination?: number;
  minInclination?: number;
}

/*
 * Spherical coordinate system.
 * Start destination is (-1, 0, 0); inclination is 0; azimuth is 0.
 */
export class SphericalCoordinate {
  origin: SAM.Vector3;
  radius: number;
  inclination: number;
  azimuth: number;
  maxInclination: number;
  minInclination: number;

  constructor(options?: SphericalCoordinateOptions) {
    this.origin = new SAM.Vector3([0, 0, 0]);
    this.radius = 1;
    this.inclination = 0;
    this.azimuth = 0;
    this.minInclination = options?.minInclination;
    this.maxInclination = options?.maxInclination;
  }

  addInclination(inclination: number): void {
    this.inclination = SAM.normalizeAngle(this.inclination + inclination);

    if (this.maxInclination != null && this.inclination > this.maxInclination) {
      this.inclination = this.maxInclination;
    } else if (
      this.minInclination != null &&
      this.inclination < this.minInclination
    ) {
      this.inclination = this.minInclination;
    }
  }

  addAzimuth(azimuth: number): void {
    this.azimuth = SAM.normalizeAngle(this.azimuth + azimuth);
  }

  setFromPoints(origin: SAM.Vector3, destination: SAM.Vector3): void {
    const destFromOrigin = destination.sub(origin);

    this.origin = origin;
    this.radius = destFromOrigin.getLength();
    this.inclination = Math.asin(destFromOrigin.getY() / this.radius);
    this.azimuth = Math.atan2(destFromOrigin.getZ(), destFromOrigin.getX());
  }

  getDestination(): SAM.Vector3 {
    const x = this.radius * Math.cos(this.inclination) * Math.cos(this.azimuth);
    const y = this.radius * Math.sin(this.inclination);
    const z = this.radius * Math.cos(this.inclination) * Math.sin(this.azimuth);

    const vectorInSphere = new SAM.Vector3([x, y, z]);
    return this.origin.add(vectorInSphere);
  }

  getUp(): SAM.Vector3 {
    const x = -Math.sin(this.inclination) * Math.cos(this.azimuth);
    const y = Math.cos(this.inclination);
    const z = -Math.sin(this.inclination) * Math.sin(this.azimuth);

    return new SAM.Vector3([x, y, z]);
  }

  toString(): string {
    return `origin: ${this.origin.toString()}, radius: ${this.radius}, inclination: ${this.inclination}, azimuth: ${this.azimuth}`;
  }
}
