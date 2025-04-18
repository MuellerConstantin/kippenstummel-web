async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

export async function solveChallenge(challenge: string) {
  const difficulty = Number(challenge.split(":")[0]);

  let counter = 0;
  let hash = "";

  while (true) {
    const data = `${challenge}:${counter}`;
    hash = await sha256(data);

    const binaryHash = BigInt("0x" + hash)
      .toString(2)
      .padStart(256, "0");

    const match = binaryHash
      .slice(0, difficulty)
      .split("")
      .every((bit) => bit === "0");

    if (match) {
      return counter;
    }

    counter++;
  }
}
