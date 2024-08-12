const DummyData = artifacts.require("DummyData");

contract("DummyData", (accounts) => {
    let dummyData;
    const [owner] = accounts;

    const ada = 123;
    const parsel = 456;
    const verim = 10;
    const kisi = "Furkan";
    const ekim = 2024;
    const hektar = 20;

    before(async () => {
        dummyData = await DummyData.new(ada, parsel, verim, kisi, ekim, hektar, { from: owner });
    });

    it("Should initialize the contract with correct values", async () => {
        const queryAda = await dummyData.queryAda();
        const queryParsel = await dummyData.queryParsel();
        const queryVerim = await dummyData.queryVerim();
        const queryKisi = await dummyData.queryKisi();
        const queryEkim = await dummyData.queryEkim();
        const queryHektar = await dummyData.queryHektar();
        const kalan = await dummyData.kalan();

        assert.equal(queryAda.toNumber(), ada, "Ada value is incorrect");
        assert.equal(queryParsel.toNumber(), parsel, "Parsel value is incorrect");
        assert.equal(queryVerim.toNumber(), verim, "Verim value is incorrect");
        assert.equal(queryKisi, kisi, "Kisi value is incorrect");
        assert.equal(queryEkim.toNumber(), ekim, "Ekim value is incorrect");
        assert.equal(queryHektar.toNumber(), hektar, "Hektar value is incorrect");

        const expectedKalan = verim * hektar;
        assert.equal(kalan.toNumber(), expectedKalan, "Kalan is incorrect");
    });

    it("Should correctly update kalan after a sale", async () => {
        const initialKalan = await dummyData.kalan();
        const satisAmount = 50;

        await dummyData.satis(satisAmount, { from: owner });

        const finalKalan = await dummyData.kalan();
        assert.equal(finalKalan.toNumber(), initialKalan.toNumber() - satisAmount, "Kalan was not updated correctly after sale");
    });

    it("Should emit Sell event after a sale", async () => {
        const satisAmount = 20;
        const receipt = await dummyData.satis(satisAmount, { from: owner });

        assert.equal(receipt.logs.length, 1, "Sell event was not emitted");
        assert.equal(receipt.logs[0].event, "Sell", "Event type is incorrect");
        assert.equal(receipt.logs[0].args.kalan.toNumber(), await dummyData.kalan(), "Sell event kalan value is incorrect");
    });

    it("Should fail when trying to sell more than kalan", async () => {
        const excessiveSatisAmount = (await dummyData.kalan()).toNumber() + 1;

        try {
            await dummyData.satis(excessiveSatisAmount, { from: owner });
            assert.fail("The transaction should have thrown an error");
        } catch (error) {
            assert(error.message.includes("Insufficient remaining product"), "Expected 'Insufficient remaining product' but got another error");
        }
    });
});
