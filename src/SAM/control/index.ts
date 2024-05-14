import * as SAM from "@site/src/SAM";

export class OrbitalControl {
  targetElement: HTMLCanvasElement;
  camera: SAM.Camera;
  isDragging: boolean;
  prevX: number | undefined;
  prevY: number | undefined;
  listeners: EventListener[];
  rotationSpeed: number;

  constructor(targetElement: HTMLCanvasElement) {
    this.targetElement = targetElement;
    this.isDragging = false;
    this.prevX = undefined;
    this.prevY = undefined;
    this.listeners = [];
    this.rotationSpeed = 0.01;
  }

  attachTo(camera: SAM.Camera): void {
    this.camera = camera;
    this.targetElement.addEventListener("mousedown", (event: MouseEvent) => {
      this.isDragging = true;
      this.prevX = event.clientX;
      this.prevY = event.clientY;
    });

    this.targetElement.addEventListener("mouseup", () => {
      this.isDragging = false;
      this.prevX = undefined;
      this.prevY = undefined;
    });

    this.targetElement.addEventListener("mouseout", () => {
      this.isDragging = false;
      this.prevX = undefined;
      this.prevY = undefined;
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
