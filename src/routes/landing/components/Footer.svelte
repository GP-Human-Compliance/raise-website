<script lang="ts">
    import { base } from "$app/paths";
    import CustomDialog from "$lib/components/CustomDialog.svelte";
    import { fetchBetaAgreement, fetchFooterData, fetchImprint, fetchLegal, fetchPrivacyPolicy } from "$lib/strapiClient";

    let legalOpen: boolean = $state(false);
    let impressOpen: boolean = $state(false);
    let privacyOpen: boolean = $state(false);
    let betaAgreementOpen: boolean = $state(false);

    let slogan: string = $state("");
    let legalLinkText: string = $state("");
    let imprintLinkText: string = $state("");
    let privacyLinkText: string = $state("");
    let betaLinkText: string = $state("");
    let logoUrl: string = $state("");

    fetchFooterData().then((strapiData) => {
        slogan = strapiData.slogan;
        legalLinkText = strapiData.legalLinkText;
        imprintLinkText = strapiData.imprintLinkText;
        privacyLinkText = strapiData.privacyLinkText;
        betaLinkText = strapiData.betaLinkText;
        logoUrl = strapiData.logo;
    });

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function handleOpenBetaAgreement() {
        betaAgreementOpen = true;
    }
    function handleCloseBetaAgreement() {
        betaAgreementOpen = false;
    }

    function handleOpenLegal() {
        legalOpen = true;
    }
    function handleCloseLegal() {
        legalOpen = false;
    }

    function handleOpenImpress() {
        impressOpen = true;
    }
    function handleCloseImpress() {
        impressOpen = false;
    }

    function handleOpenPrivacy() {
        privacyOpen = true;
    }
    function handleClosePrivacy() {
        privacyOpen = false;
    }
</script>

<CustomDialog open={betaAgreementOpen} onClose={handleCloseBetaAgreement} fetchFunction={fetchBetaAgreement}/>
<CustomDialog open={legalOpen} onClose={handleCloseLegal} fetchFunction={fetchLegal}/>
<CustomDialog open={impressOpen} onClose={handleCloseImpress} fetchFunction={fetchImprint}/>
<CustomDialog open={privacyOpen} onClose={handleClosePrivacy} fetchFunction={fetchPrivacyPolicy}/>

<div class="w-full px-5 py-20 md:px-10 md:py-20 bg-black">
    <div class="max-w-[1060px] mx-auto px-4">
        <div class="bg-black text-white flex justify-between items-center">
            <div class="flex items-center space-x-3">
                <a href="{base}/">
                    <div class="inline cursor-pointer" on:click={scrollToTop}>
                        <img src={logoUrl} class="w-auto h-[103px]" />
                    </div>
                </a>
            </div>

            <div class="flex flex-col text-right font-thin text-sm sm:text-base space-y-1">
                <span on:click={handleOpenLegal} class="hover:underline hover:text-[#4FCAA7] transition-colors"
                    >{legalLinkText}</span>
                <span on:click={handleOpenPrivacy} class="hover:underline hover:text-[#4FCAA7] transition-colors"
                    >{privacyLinkText}</span>
                <span on:click={handleOpenBetaAgreement} class="hover:underline hover:text-[#4FCAA7] transition-colors"
                    >{betaLinkText}</span>
                <span on:click={handleOpenImpress} class="hover:underline hover:text-[#4FCAA7] transition-colors"
                    >{imprintLinkText}</span>
            </div>
        </div>
    </div>
</div>
