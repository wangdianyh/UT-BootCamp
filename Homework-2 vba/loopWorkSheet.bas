Attribute VB_Name = "loopWorkSheet"
Sub loopWorkSheet()
    Dim wsCount As Integer
    
    wsCount = ActiveWorkbook.Worksheets.Count

    ' begin the loop
    For I = 1 To wsCount
        With Sheets(I)
            Worksheets(I).Activate
            Call printTicker.printTicker
            Call printVolume.printVolume
            Call yearChange.yearChange
            Call summariseData.summariseData
        End With
        
        MsgBox ("this worksheet Done")
    Next I
    
End Sub
