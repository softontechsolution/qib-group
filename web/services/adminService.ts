// web/services/adminService.ts

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Fetches aggregated dashboard metrics and all motor insurance registrations from Strapi.
 */
export async function fetchAdminDashboardData() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/admin/dashboard-stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensures fresh data on every page load
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch admin stats: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error connecting to Strapi admin service:", error);
    return null;
  }
}

/**
 * Triggers a retry for a failed email dispatch via Strapi backend queue.
 */
export async function retryEmailDispatch(registrationId: number | string) {
  const response = await fetch(
    `${STRAPI_URL}/api/admin/retry-email/${registrationId}`,
    {
      method: "POST",
    },
  );
  return response.json();
}

/**
 * Triggers a retry for a failed NPF portal sync via Strapi backend queue.
 */
export async function retryNpfSyncDispatch(registrationId: number | string) {
  const response = await fetch(
    `${STRAPI_URL}/api/admin/retry-npf/${registrationId}`,
    {
      method: "POST",
    },
  );
  return response.json();
}

// Add this function to your web/services/adminService.ts file
export async function fetchAdminCustomers() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/admin/customers`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch customers telemetry");
    return await response.json();
  } catch (error) {
    console.error("Error connecting to Strapi customers service:", error);
    return null;
  }
}

// Add this function to your web/services/adminService.ts file

export async function fetchAdminAgents() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/admin/agents`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch agents telemetry");
    return await response.json();
  } catch (error) {
    console.error("Error connecting to Strapi agents service:", error);
    return null;
  }
}

// Add these functions to your web/services/adminService.ts file

export async function fetchAdminPolicies() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/admin/policies`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch policies telemetry");
    return await response.json();
  } catch (error) {
    console.error("Error connecting to Strapi policies service:", error);
    return null;
  }
}

export async function updateAdminPolicyData(id: string | number, payload: any) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/admin/policies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to update policy record");
    return await response.json();
  } catch (error) {
    console.error("Error connecting to update policy service:", error);
    return null;
  }
}

// Add these functions to your web/services/adminService.ts file

export async function fetchAdminInsurers() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/admin/insurers`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch insurers telemetry");
    return await response.json();
  } catch (error) {
    console.error("Error connecting to Strapi insurers service:", error);
    return null;
  }
}

export async function uploadMediaToStrapi(file: File) {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload media file");
    const data = await response.json();
    return data[0]?.id || null;
  } catch (error) {
    console.error("Error uploading media to Strapi:", error);
    return null;
  }
}

export async function createAdminInsurer(payload: {
  name: string;
  slug: string;
  isActive: boolean;
  priority: number;
  logo?: number | null;
}) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/admin/insurers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to create insurer partner");
    return await response.json();
  } catch (error) {
    console.error("Error connecting to create insurer service:", error);
    return null;
  }
}

export async function updateAdminInsurer(
  id: string | number,
  payload: {
    name?: string;
    slug?: string;
    isActive?: boolean;
    priority?: number;
    logo?: number | null;
  },
) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/admin/insurers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to update insurer partner");
    return await response.json();
  } catch (error) {
    console.error("Error connecting to update insurer service:", error);
    return null;
  }
}

// Add these functions to your web/services/adminService.ts file

export async function fetchAdminPayments() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/admin/payments`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch payments telemetry");
    return await response.json();
  } catch (error) {
    console.error("Error connecting to Strapi payments service:", error);
    return null;
  }
}

export async function verifyAdminPayment(reference: string) {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/admin/payments/verify/${reference}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!response.ok) throw new Error("Failed to verify payment transaction");
    return await response.json();
  } catch (error) {
    console.error("Error connecting to verify payment service:", error);
    return null;
  }
}
