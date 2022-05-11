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
            text-color="black"
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
            text-color="black"
            label="Favorite Monitoring"
            @click="handleFavoriteBtnClicked"
          />
        </div>
        <div class="col-sm-6 q-pl-sm">
          <q-btn
            class="full-width"
            color="orange"
            text-color="black"
            label="Bookmark"
            @click="handleBookmarkBtnClicked"
          />
        </div>
      </div>
    </div>
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

    return {
      handleStartBtnClicked,
      handleBookmarkBtnClicked,
      handleFavoriteBtnClicked,
    }
  }
})
</script>
