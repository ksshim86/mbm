<template>
  <q-page>
    <div class="fixed-center">
      <div class="row text-center">
        <div class="col">
          <div class="text-h4">
            <q-icon
              name="dashboard"
              size="40px"
              class="q-mb-sm"
              color="orange"
            />
            Multi Browser Monitoring
            <q-badge
              align="top"
              color="orange"
              text-color="black"
            >beta</q-badge>
          </div>
        </div>
      </div>
      <div class="row text-center q-mt-lg">
        <div class="col">
          <q-btn
            class="full-width"
            color="orange"
            text-color="dark"
            label="Start"
            @click="handleStartBtnClicked"
          />
        </div>
      </div>
      <div class="row text-center q-mt-lg">
        <div class="col-sm-6 q-pr-sm">
          <q-btn
            class="full-width"
            color="orange"
            text-color="dark"
            label="Monitoring Favorites"
            icon="favorite"
            @click="handleFavoriteBtnClicked"
          />
        </div>
        <div class="col-sm-6 q-pl-sm">
          <q-btn
            class="full-width"
            color="orange"
            text-color="dark"
            label="Bookmarks"
            icon="bookmark"
            @click="handleBookmarkBtnClicked"
          />
        </div>
      </div>
    </div>
    <q-footer class="bg-dark q-pa-md text-right">
      <q-btn
        flat
        no-caps
        label="https://github.com/ksshim86/mbm"
        icon="img:icons/GitHub-Mark-Light-64px.png"
        @click="handleGithubBtnClicked"
      />
    </q-footer>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'IndexPage',
  setup () {
    const router = useRouter()

    const handleStartBtnClicked = () => {
      router.push('/preview')
    }

    const handleBookmarkBtnClicked = () => {
      router.push('/bookmark')
    }

    const handleFavoriteBtnClicked = () => {
      router.push('/favorite')
    }

    const handleGithubBtnClicked = () => {
      window.myWindowAPI.newWindow('https://github.com/ksshim86/mbm')
    }

    return {
      handleStartBtnClicked,
      handleBookmarkBtnClicked,
      handleFavoriteBtnClicked,
      handleGithubBtnClicked,
    }
  }
})
</script>
