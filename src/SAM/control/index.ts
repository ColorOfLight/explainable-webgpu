import * as SAM from "@site/src/SAM";

export class OrbitalControl {
  targetElement: HTMLCanvasElement;
  camera: SAM.Camera;
  isDragging: boolean;
  isRightDragging: boolean;
  prevX: number | undefined;
  prevY: number | undefined;
  listeners: EventListener[];
  rotationSpeed: number;
  translationSpeed: number;
  zoomingSpeed: number;
  targetWidth: number;
  targetHeight: number;
  sphericalCoordinate: SAM.SphericalCoordinate;

  constructor(targetElement: HTMLCanvasElement) {
    this.targetElement = targetElement;
    this.isDragging = false;
    this.isRightDragging = false;
    this.prevX = undefined;
    this.prevY = undefined;
    this.listeners = [];
    this.rotationSpeed = 4;
    this.translationSpeed = 1;
    this.zoomingSpeed = 0.005;
    this.targetWidth = targetElement.clientWidth;
    this.targetHeight = targetElement.clientHeight;
    this.sphericalCoordinate = new SAM.SphericalCoordinate({
      maxInclination: Math.PI / 2,
      minInclination: -Math.PI / 2,
    });
  }

  attachTo(camera: SAM.Camera): void {
    this.camera = camera;
    this.sphericalCoordinate.setFromPoints(camera.target, camera.eye);

    this.targetElement.addEventListener("mousedown", (event: MouseEvent) => {
      this.isDragging = true;
      this.prevX = event.clientX;
      this.prevY = event.clientY;

      event.preventDefault();
    });

    this.targetElement.addEventListener("contextmenu", (event) => {
      this.isRightDragging = true;

      event.preventDefault();
    });

    this.targetElement.addEventListener("mouseup", (event: MouseEvent) => {
      this.isDragging = false;
      this.isRightDragging = false;
      this.prevX = undefined;
      this.prevY = undefined;

      event.preventDefault();
    });

    this.targetElement.addEventListener("mouseout", (event: MouseEvent) => {
      this.isDragging = false;
      this.isRightDragging = false;
      this.prevX = undefined;
      this.prevY = undefined;

      event.preventDefault();
    });

    this.targetElement.addEventListener("mousemove", (event: MouseEvent) => {
      if (this.isDragging) {
        if (this.prevX === undefined) {
          throw new Error("prevX is undefined");
        }

        if (this.prevY === undefined) {
          throw new Error("prevY is undefined");
        }

        const deltaX = (event.clientX - this.prevX) / this.targetHeight;
        const deltaY = (event.clientY - this.prevY) / this.targetHeight;

        if (this.isRightDragging) {
          const temporalRight = this.camera.eye
            .sub(this.camera.target)
            .cross(this.camera.up);

          this.sphericalCoordinate.origin.setAdd(
            temporalRight.multiplyScalar(deltaX * this.translationSpeed)
          );
          this.sphericalCoordinate.origin.setAdd(
            this.camera.up.multiplyScalar(deltaY * this.translationSpeed)
          );
        } else {
          this.sphericalCoordinate.addAzimuth(deltaX * this.rotationSpeed);
          this.sphericalCoordinate.addInclination(deltaY * this.rotationSpeed);
        }
      }

      this.camera.eye = this.sphericalCoordinate.getDestination();
      this.camera.up = this.sphericalCoordinate.getUp();

      this.prevX = event.clientX;
      this.prevY = event.clientY;

      event.preventDefault();
    });

    this.targetElement.addEventListener("wheel", (event: WheelEvent) => {
      const deltaY = event.deltaY;

      if (
        deltaY < 0 ||
        Math.abs(deltaY * this.zoomingSpeed) < this.sphericalCoordinate.radius
      ) {
        this.sphericalCoordinate.radius -= deltaY * this.zoomingSpeed;
        this.camera.eye = this.sphericalCoordinate.getDestination();
      }

      event.preventDefault();
    });
  }
}
