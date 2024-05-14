import * as SAM from "@site/src/SAM";

export class OrbitalControl {
  targetElement: HTMLCanvasElement;
  camera: SAM.Camera;
  isDragging: boolean;
  prevX: number | undefined;
  prevY: number | undefined;
  listeners: EventListener[];
  rotationSpeed: number;
  translationSpeed: number;

  constructor(targetElement: HTMLCanvasElement) {
    this.targetElement = targetElement;
    this.isDragging = false;
    this.prevX = undefined;
    this.prevY = undefined;
    this.listeners = [];
    this.rotationSpeed = 0.01;
    this.translationSpeed = 0.005;
  }

  attachTo(camera: SAM.Camera): void {
    this.camera = camera;
    this.targetElement.addEventListener("mousedown", (event: MouseEvent) => {
      this.isDragging = true;
      this.prevX = event.clientX;
      this.prevY = event.clientY;

      event.preventDefault();
    });

    this.targetElement.addEventListener("mouseup", () => {
      this.isDragging = false;
      this.prevX = undefined;
      this.prevY = undefined;

      event.preventDefault();
    });

    this.targetElement.addEventListener("mouseout", () => {
      this.isDragging = false;
      this.prevX = undefined;
      this.prevY = undefined;

      event.preventDefault();
    });

    this.targetElement.addEventListener("mousemove", (event) => {
      if (this.isDragging) {
        if (this.prevX === undefined) {
          throw new Error("prevX is undefined");
        }

        if (this.prevY === undefined) {
          throw new Error("prevY is undefined");
        }

        const deltaX = event.clientX - this.prevX;
        const deltaY = event.clientY - this.prevY;

        this.rotateCamera(deltaX, deltaY);

        this.prevX = event.clientX;
        this.prevY = event.clientY;
      }

      event.preventDefault();
    });

    this.targetElement.addEventListener("wheel", (event) => {
      const deltaY = event.deltaY;

      const cameraFromTarget = this.camera.eye.sub(this.camera.target);
      const cameraFromTargetLength = cameraFromTarget.getLength();

      if (
        Math.abs(deltaY * this.translationSpeed) < cameraFromTargetLength ||
        deltaY * cameraFromTargetLength < 0
      ) {
        this.camera.eye = this.camera.eye.sub(
          cameraFromTarget.multiplyScalar(deltaY * this.translationSpeed)
        );
      }

      event.preventDefault();
    });

    this.targetElement.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  rotateCamera(deltaX: number, deltaY: number): void {
    const horizontalAngle = deltaX * this.rotationSpeed;
    const verticalAngle = deltaY * this.rotationSpeed;

    const direction = this.camera.eye.sub(this.camera.target);

    const horizontalAxis = this.camera.up.normalize();
    const verticalAxis = this.camera.up.cross(direction).normalize();

    direction.setRotateAroundAxis(horizontalAxis, -horizontalAngle);
    this.camera.up.setRotateAroundAxis(horizontalAxis, -horizontalAngle);

    direction.setRotateAroundAxis(verticalAxis, -verticalAngle);
    this.camera.up.setRotateAroundAxis(verticalAxis, -verticalAngle);

    this.camera.eye = this.camera.target.add(direction);
  }
}
