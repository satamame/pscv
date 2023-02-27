<div class="container">
  <div class="spinner"></div>
</div>

<style>
  .container {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .spinner {
    width: 100px;
    height: 100px;
    border: 10px #ddd solid;
    border-top: 10px #2e93e6 solid;
    border-radius: 50%;
    animation: sp-anime 1.0s infinite linear;
  }

  @keyframes sp-anime {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
