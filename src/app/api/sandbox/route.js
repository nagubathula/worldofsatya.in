export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || typeof body.files !== "object") {
      return Response.json({ error: "Missing files payload" }, { status: 400 });
    }

    const upstream = await fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ files: body.files }),
    });

    if (!upstream.ok) {
      return Response.json(
        { error: `CodeSandbox define failed (${upstream.status})` },
        { status: 502 },
      );
    }

    const data = await upstream.json();
    if (!data?.sandbox_id) {
      return Response.json({ error: "No sandbox_id returned" }, { status: 502 });
    }

    return Response.json({ sandbox_id: data.sandbox_id });
  } catch (err) {
    return Response.json(
      { error: err?.message || "Failed to create CodeSandbox" },
      { status: 500 },
    );
  }
}
