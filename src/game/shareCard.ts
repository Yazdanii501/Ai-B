export interface ShareStats {
  discovered: number;
  total: number;
  badgeCount: number;
  badgeTotal: number;
}

export async function renderShareCard(stats: ShareStats): Promise<Blob> {
  const width = 1200;
  const height = 675;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#14100C");
  bg.addColorStop(1, "#0A0A0C");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width / 2, height / 2 - 30, 40, width / 2, height / 2 - 30, 460);
  glow.addColorStop(0, "rgba(230,200,136,0.16)");
  glow.addColorStop(1, "rgba(230,200,136,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(230,200,136,0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(28.5, 28.5, width - 57, height - 57);

  ctx.textAlign = "center";
  ctx.fillStyle = "#8A8A94";
  ctx.font = "500 20px Georgia, serif";
  ctx.fillText("A living periodic table", width / 2, 190);

  ctx.fillStyle = "#F3F0E7";
  ctx.font = "500 84px Georgia, serif";
  ctx.fillText("Elementa", width / 2, 280);

  ctx.fillStyle = "#E6C888";
  ctx.font = "italic 500 28px Georgia, serif";
  ctx.fillText(
    stats.discovered >= stats.total ? "Every element, discovered." : "The collection is growing.",
    width / 2,
    336
  );

  const cols = [
    [`${stats.discovered} / ${stats.total}`, "elements discovered"],
    [`${stats.badgeCount} / ${stats.badgeTotal}`, "category badges"],
  ] as const;

  const colWidth = width / 2;
  cols.forEach(([value, label], i) => {
    const cx = colWidth * i + colWidth / 2;
    ctx.fillStyle = "#E8A94B";
    ctx.font = "500 46px Georgia, serif";
    ctx.fillText(value, cx, 460);
    ctx.fillStyle = "#8A8A94";
    ctx.font = "16px Georgia, serif";
    ctx.fillText(label, cx, 494);
  });

  ctx.strokeStyle = "rgba(230,200,136,0.25)";
  ctx.beginPath();
  ctx.moveTo(width / 2, 420);
  ctx.lineTo(width / 2, 500);
  ctx.stroke();

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not render the share card."));
    }, "image/png");
  });
}
