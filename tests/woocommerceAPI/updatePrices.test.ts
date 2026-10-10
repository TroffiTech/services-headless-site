import { updateStore } from "@/server_utils/woocommerceAPI/updatePrices";
import { getStore } from "@/server_utils/woocommerceAPI/storeManager";

// Mock the storeManager
jest.mock("@/server_utils/woocommerceAPI/storeManager", () => ({
  getStore: jest.fn(),
}));

describe("updateStore - Result States", () => {
  let mockStore: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = {
      getProductIdsBySkus: jest.fn(),
      updateProducts: jest.fn(),
    };
    (getStore as jest.Mock).mockResolvedValue(mockStore);
  });

  it("should return SUCCESS when product is found and updated", async () => {
    const sku = "test-sku";
    const price = "100";
    mockStore.getProductIdsBySkus.mockResolvedValue([{ id: 123, sku }]);
    mockStore.updateProducts.mockResolvedValue([{ id: 123, regular_price: price }]);

    const result = await updateStore(
      "https://store.com",
      { key: "ck_123", secret: "cs_123" },
      { [sku]: price }
    );

    expect(result).toEqual({ error: false, success: true });
  });

  it("should return NOT_FOUND as a success state when product is missing", async () => {
    const sku = "missing-sku";
    mockStore.getProductIdsBySkus.mockResolvedValue([]); // Product not found

    const result = await updateStore(
      "https://store.com",
      { key: "ck_123", secret: "cs_123" },
      { [sku]: "100" }
    );

    // As per the new requirement: Not found is NOT an error, but a specific success state
    expect(result).toEqual({
      error: false,
      success: true,
      message: "Product not found in store",
    });
  });

  it("should return ERROR when updateProducts fails (Real 500 case)", async () => {
    const sku = "test-sku";
    mockStore.getProductIdsBySkus.mockResolvedValue([{ id: 123, sku }]);
    mockStore.updateProducts.mockResolvedValue([]); // API returned empty/error

    const result = await updateStore(
      "https://store.com",
      { key: "ck_123", secret: "cs_123" },
      { [sku]: "100" }
    );

    expect(result).toEqual({ error: true, success: false });
  });

  it("should return ERROR on critical exception (Connection failure)", async () => {
    (getStore as jest.Mock).mockRejectedValue(new Error("Network Timeout"));

    const result = await updateStore(
      "https://store.com",
      { key: "ck_123", secret: "cs_123" },
      { "sku": "100" }
    );

    expect(result).toEqual({ error: true, success: false });
  });
});
