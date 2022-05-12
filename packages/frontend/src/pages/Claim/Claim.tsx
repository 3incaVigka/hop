import React, { useState } from 'react'
import { Claiming, Claimed } from 'src/pages/Claim'
import Box from '@material-ui/core/Box'
import { useThemeMode } from 'src/theme/ThemeProvider'
import { ChooseDelegate } from './ChooseDelegate'
import { ClaimReview } from './ClaimReview'
import { ClaimStart } from './ClaimStart'
import { useClaim } from './useClaim'
import { ClaimWrapper } from './ClaimWrapper'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { correctClaimChain } from './claims'
import { formatError } from 'src/utils/format'

export function Claim() {
  const { isDarkMode } = useThemeMode()
  const { connectedNetworkId } = useWeb3Context()
  const [step, setStep] = useState(0)
  const [showTryAgain, setShowTryAgain] = useState(false)
  const nextStep = () => setStep(val => val + 1)
  const prevStep = () => setStep(val => val - 1)
  const {
    claimableTokens,
    loading,
    warning,
    sendClaimTokens,
    claiming,
    inputValue,
    setInputValue,
    claimTokensTx,
    delegate,
    setDelegate,
    error,
    setError
  } = useClaim()

  async function claimTokens() {
    try {
      setError('')
      setShowTryAgain(false)
      const res = await sendClaimTokens()
      if (res?.status === 1) {
        setShowTryAgain(false)
        nextStep()
      } else {
        setShowTryAgain(true)
      }
    } catch (err: any) {
      console.error(err)
      setError(formatError(err.message))
      setShowTryAgain(true)
    }
  }

  const steps = [
    <ClaimStart
      key="Claim HOP"
      claimableTokens={claimableTokens}
      nextStep={nextStep}
      isDarkMode={isDarkMode}
    />,
    <ChooseDelegate
      key="Choose a Delegate"
      setInputValue={setInputValue}
      inputValue={inputValue}
      delegate={delegate}
      onContinue={nextStep}
      selectDelegate={setDelegate}
    />,
    <ClaimReview
      key="Review your Claim"
      claimableTokens={claimableTokens}
      prevStep={prevStep}
      delegate={delegate}
      isDarkMode={isDarkMode}
      handleClaimTokens={() => {
        nextStep()
        claimTokens()
      }}
    />,
    <Claiming
      key="Confirm with Wallet"
      claiming={claiming}
      isDarkMode={isDarkMode}
      tx={claimTokensTx}
      delegate={delegate}
      claimableTokens={claimableTokens}
      showTryAgain={showTryAgain}
      handleClaimTokens={() => {
        claimTokens()
      }}
    />,
    <Claimed key="" />,
  ]

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" textAlign="center">
      <ClaimWrapper
        loading={loading}
        isDarkMode={isDarkMode}
        connectedNetworkId={connectedNetworkId}
        correctClaimChain={correctClaimChain}
        claimableTokens={claimableTokens}
        title={steps[step].key}
        warning={warning}
        step={step}
        prevStep={prevStep}
        nextStep={nextStep}
        handleClaimTokens={claimTokens}
        delegate={delegate}
        claiming={claiming}
        inputValue={inputValue}
        setInputValue={setInputValue}
        setStep={setStep}
        error={error}
        setError={setError}
      >
        {steps[step]}
      </ClaimWrapper>
    </Box>
  )
}
