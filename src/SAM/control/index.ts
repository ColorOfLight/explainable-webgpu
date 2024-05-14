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

  constructor(targetElement: HTMLCanvasElement) {
    this.targetElement = targetElement;
    this.isDragging = false;
    this.isRightDragging = false;
    this.prevX = undefined;
    this.prevY = undefined;
    this.listeners = [];
    this.rotationSpeed = 0.01;
    this.translationSpeed = 0.0001;
    this.zoomingSpeed = 0.005;
  }

  attachTo(camera: SAM.Camera): void {
    this.camera = camera;
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

        const deltaX = event.clientX - this.prevX;
        const deltaY = event.clientY - this.prevY;

        if (this.isRightDragging) {
          const cameraFromTarget = this.camera.eye.sub(this.camera.target);
          const up = this.camera.up.normalize();
          const right = cameraFromTarget.cross(up).normalize();
          const projMatrix = this.camera.getViewTransformMatrix();
          const translation = up
            .multiplyScalar(deltaY * this.translationSpeed)
            .add(right.multiplyScalar(deltaX * this.translationSpeed));

          this.camera.eye = this.camera.eye.add(translation);
          this.camera.target = projMatrix.productVector3(
            this.camera.target.add(translation)
          );
        } else {
          this.rotateCamera(deltaX, deltaY);

          this.prevX = event.clientX;
          this.prevY = event.clientY;
        }
      }

      event.preventDefault();
    });

    this.targetElement.addEventListener("wheel", (event: WheelEvent) => {
      const deltaY = event.deltaY;

      const cameraFromTarget = this.camera.eye.sub(this.camera.target);
      const cameraFromTargetLength = cameraFromTarget.getLength();

      if (
        Math.abs(deltaY * this.zoomingSpeed) < cameraFromTargetLength ||
        deltaY * cameraFromTargetLength < 0
      ) {
        this.camera.eye = this.camera.eye.sub(
          cameraFromTarget.multiplyScalar(deltaY * this.zoomingSpeed)
        );
      }

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
