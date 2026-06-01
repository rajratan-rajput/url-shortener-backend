const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegisterInput({ name, email, password }) {
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return { ok: false, message: "Name must be at least 2 characters" };
  }

  if (!email || typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return { ok: false, message: "A valid email is required" };
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters" };
  }

  return {
    ok: true,
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    },
  };
}

export function validateLoginInput({ email, password }) {
  if (!email || typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return { ok: false, message: "A valid email is required" };
  }

  if (!password || typeof password !== "string") {
    return { ok: false, message: "Password is required" };
  }

  return {
    ok: true,
    data: {
      email: email.trim().toLowerCase(),
      password,
    },
  };
}
