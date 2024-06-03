import * as SAM from "@site/src/SAM";

interface SphericalCoordinateOptions {
  maxInclination?: number;
  minInclination?: number;
  radius?: number;
}

/*
 * Spherical coordinate system.
 * Polar angle is the angle from the positive y-axis.
 * Azimuth angle is the angle in the xy-plane from the positive x-axis.
 */
export class SphericalCoordinate {
  origin: SAM.Vector3;
  radius: number;
  polar: number;
  azimuth: number;
  maxInclination: number;
  minInclination: number;

  constructor(options?: SphericalCoordinateOptions) {
    this.origin = new SAM.Vector3(0, 0, 0);
    this.radius = options?.radius ?? 1;
    this.polar = 0;
    this.azimuth = 0;
    this.minInclination = options?.minInclination;
    this.maxInclination = options?.maxInclination;
  }

  addInclination(polar: number): void {
    this.polar = SAM.normalizeAngle(this.polar + polar);

    if (this.maxInclination != null && this.polar > this.maxInclination) {
      this.polar = this.maxInclination;
    } else if (
      this.minInclination != null &&
      this.polar < this.minInclination
    ) {
      this.polar = this.minInclination;
    }
  }

  addAzimuth(azimuth: number): void {
    this.azimuth = SAM.normalizeAngle(this.azimuth + azimuth);
  }

  setInclination(polar: number): void {
    this.polar = polar;

    if (this.maxInclination != null && this.polar > this.maxInclination) {
      this.polar = this.maxInclination;
    } else if (
      this.minInclination != null &&
      this.polar < this.minInclination
    ) {
      this.polar = this.minInclination;
    }
  }

  setAzimuth(azimuth: number): void {
    this.azimuth = azimuth;
  }

  setFromPoints(origin: SAM.Vector3, destination: SAM.Vector3): void {
    const destFromOrigin = destination.sub(origin);

    this.origin = origin;
    this.radius = destFromOrigin.getLength();
    this.polar = Math.asin(destFromOrigin.y / this.radius);
    this.azimuth = Math.atan2(destFromOrigin.z, destFromOrigin.x);
  }

  getDestination(): SAM.Vector3 {
    const x = this.radius * Math.cos(this.polar) * Math.cos(this.azimuth);
    const y = this.radius * Math.sin(this.polar);
    const z = this.radius * Math.cos(this.polar) * Math.sin(this.azimuth);

    const vectorInSphere = new SAM.Vector3(x, y, z);
    return this.origin.add(vectorInSphere);
  }

  getUp(): SAM.Vector3 {
    const x = -Math.sin(this.polar) * Math.cos(this.azimuth);
    const y = Math.cos(this.polar);
    const z = -Math.sin(this.polar) * Math.sin(this.azimuth);

    return new SAM.Vector3(x, y, z);
  }

  toString(): string {
    return `origin: ${this.origin.toString()}, radius: ${this.radius}, polar: ${this.polar}, azimuth: ${this.azimuth}`;
  }
}
